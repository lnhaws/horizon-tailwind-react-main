// src/views/store/cart/index.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🌟 Đã thêm useNavigate
import cartApi from "api/cartApi";
import orderApi from "api/orderApi"; // 🌟 Đã thêm orderApi
import { MdDelete, MdSecurity } from "react-icons/md";

export default function StoreCart() {
  const navigate = useNavigate(); // 🌟 Khai báo navigate
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const getImageUrl = (url) => {
    if (!url || url === "null" || url === "undefined") return "https://via.placeholder.com/150?text=No+Image";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `http://localhost:8900/api/catalog/${cleanUrl}`;
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCartItems(data || []);
    } catch (error) {
      setCartItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    if (window.confirm("Bỏ sản phẩm này khỏi giỏ hàng?")) {
      try {
        await cartApi.removeFromCart(productId);
        window.dispatchEvent(new Event('cartUpdated'));
        setCartItems(prev => prev.filter(item => item.product?.id !== productId));
        setSelectedItemIds(prev => prev.filter(id => id !== productId));
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm!");
      }
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItemIds.length === 0) return;
    if (window.confirm("Xóa các sản phẩm đang chọn khỏi giỏ hàng?")) {
      try {
        for (const id of selectedItemIds) {
          await cartApi.removeFromCart(id);
        }
        window.dispatchEvent(new Event('cartUpdated'));
        setCartItems(prev => prev.filter(item => !selectedItemIds.includes(item.product?.id)));
        setSelectedItemIds([]);
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa danh sách!");
      }
    }
  };

  const handleQuantityChange = (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    setCartItems(prev => prev.map(item => {
      if (item.product?.id === productId) {
        return { ...item, quantity: newQty, subTotal: (item.product?.price || 0) * newQty };
      }
      return item;
    }));
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === cartItems.length && cartItems.length > 0) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map(item => item.product?.id));
    }
  };

  const handleSelectItem = (productId) => {
    if (selectedItemIds.includes(productId)) {
      setSelectedItemIds(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedItemIds(prev => [...prev, productId]);
    }
  };

  const handleCheckout = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.id) {
      alert("Vui lòng đăng nhập để tiến hành đặt hàng!");
      navigate("/auth/sign-in");
      return;
    }
    navigate("/checkout", { state: { selectedItemIds: selectedItemIds } });
  };

  const selectedItems = cartItems.filter(item => selectedItemIds.includes(item.product?.id));
  const totalAmount = selectedItems.reduce((sum, item) => {
    return sum + (item.subTotal || ((item.product?.price || 0) * (item.quantity || 1)));
  }, 0);

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  if (loading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-10">

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black text-navy-700 dark:text-white">Giỏ Hàng Của Bạn</h1>
        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-brand-500 transition">
          &lt; Tiếp tục mua sắm
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-white py-20 shadow-sm">
          <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="mb-6 h-32 w-32 opacity-50 grayscale" />
          <h2 className="mb-2 text-xl font-bold text-navy-700">Giỏ hàng của bạn còn trống</h2>
          <Link to="/" className="mt-4 rounded-lg bg-brand-500 px-8 py-3 text-sm font-bold text-white hover:bg-brand-600 transition">
            MUA SẮM NGAY
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* CỘT TRÁI: TOOLBAR & DANH SÁCH */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">

            {/* TOOLBAR CHỌN TẤT CẢ */}
            <div className="flex items-center justify-between px-2 py-2">
              <div
                onClick={handleSelectAll}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${isAllSelected ? 'scale-110 bg-red-500 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]' : 'border-gray-300 bg-white group-hover:border-red-400'}`}>
                  {isAllSelected && (
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-navy-700 dark:text-white">
                  Chọn tất cả ({cartItems.length})
                </span>
              </div>

              {/* NÚT XÓA */}
              {selectedItemIds.length > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="text-sm text-gray-500 hover:text-red-500 transition font-medium"
                >
                  Xóa sản phẩm đã chọn
                </button>
              )}
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            {cartItems.map((item, index) => {
              const prod = item.product || {};
              const isSelected = selectedItemIds.includes(prod.id);

              return (
                <div key={index} className="flex gap-4 rounded-xl bg-white p-4 border border-gray-200 dark:border-navy-700 dark:bg-navy-800">

                  <div onClick={() => handleSelectItem(prod.id)} className="pt-1 pl-1 cursor-pointer shrink-0">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${isSelected ? 'scale-110 bg-red-500 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]' : 'border-gray-300 bg-white hover:border-red-400'}`}>
                      {isSelected && (
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <Link to={`/product/${prod.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded border border-gray-100">
                    <img
                      src={getImageUrl(prod.imageUrl)}
                      alt={prod.productName}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col">
                        <Link to={`/product/${prod.id}`} className="line-clamp-2 text-base font-medium text-navy-700 hover:text-brand-500 dark:text-white leading-snug">
                          {prod.productName || "Sản phẩm không xác định"}
                        </Link>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-red-500">{prod.price ? prod.price.toLocaleString('vi-VN') : 0} ₫</span>
                          <span className="text-sm text-gray-400 line-through">
                            {prod.price ? (prod.price * 1.2).toLocaleString('vi-VN') : 0} ₫
                          </span>
                        </div>
                      </div>

                      <button onClick={() => handleRemove(prod.id)} className="text-gray-400 hover:text-red-500 shrink-0 mt-1">
                        <MdDelete size={20} />
                      </button>
                    </div>

                    <div className="flex justify-end mt-2">
                      <div className="flex items-center rounded border border-gray-200 bg-white">
                        <button
                          onClick={() => handleQuantityChange(prod.id, item.quantity, -1)}
                          className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                        >
                          -
                        </button>
                        <span className="flex h-7 w-10 items-center justify-center border-x border-gray-200 text-sm font-medium text-navy-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(prod.id, item.quantity, 1)}
                          className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <h2 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 border-b border-gray-100 pb-4 dark:border-navy-700">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tạm tính ({selectedItemIds.length} sản phẩm)</span>
                  <span className="font-medium text-navy-700 dark:text-white">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phí vận chuyển</span>
                  <span className="text-sm font-medium text-green-500">Miễn phí</span>
                </div>
              </div>

              <div className="mb-6 mt-4 flex items-end justify-between">
                <span className="text-base font-bold text-navy-700 dark:text-white">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-500">{totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>

              {/* 🌟 NÚT THANH TOÁN (ĐÃ GẮN SỰ KIỆN) */}
              <button
                onClick={handleCheckout}
                disabled={selectedItemIds.length === 0}
                className={`w-full rounded py-3 text-sm font-bold text-white transition-colors
                      ${selectedItemIds.length > 0
                    ? 'bg-brand-500 hover:bg-brand-600'
                    : 'bg-gray-300 cursor-not-allowed dark:bg-navy-600'}`}
              >
                TIẾN HÀNH ĐẶT HÀNG {selectedItemIds.length > 0 ? `(${selectedItemIds.length})` : ''}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <MdSecurity size={14} />
                <span>Bảo mật thông tin & thanh toán 100%</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}