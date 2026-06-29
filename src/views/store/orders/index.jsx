// src/views/store/orders/index.jsx
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import orderApi from "api/orderApi";
import { MdOutlineReceipt, MdLocalCafe } from "react-icons/md";

export default function StoreOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `http://localhost:8900/api/catalog/${cleanUrl}`;
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!currentUser) return;
      try {
        const data = await orderApi.getUserOrders(currentUser.id);
        const sortedOrders = (data || []).sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5C4033] border-t-transparent"></div>
          <p className="font-bold text-[#5C4033]">Đang lấy hóa đơn...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl animate-fade-in pb-10">
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-navy-700">
        <h1 className="text-3xl font-black font-serif text-[#5C4033] dark:text-white flex items-center gap-3">
          <MdOutlineReceipt className="text-amber-500" size={32} /> Lịch sử Đơn hàng
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[30px] bg-white py-24 shadow-sm border border-orange-50 dark:bg-navy-800 dark:border-navy-700">
          <MdLocalCafe className="mb-4 text-7xl text-amber-100 dark:text-navy-600" />
          <p className="text-2xl font-serif font-black text-[#5C4033] dark:text-white">Bạn chưa có đơn hàng nào.</p>
          <p className="mt-2 text-gray-500">Hãy chọn cho mình một ly nước ưng ý nhé!</p>
          <Link to="/" className="mt-6 rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-400 hover:scale-105 active:scale-95">
            KHÁM PHÁ MENU
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[24px] bg-white p-6 md:p-8 shadow-sm border border-orange-50 transition-all hover:shadow-xl hover:shadow-amber-900/5 dark:border-navy-700 dark:bg-navy-800">
              
              {/* Header của đơn hàng */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-5 gap-3 dark:border-navy-700">
                <div className="flex items-center gap-4">
                  <span className="text-base font-black text-[#5C4033] dark:text-white">Đơn hàng #{order.id}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span className="text-sm font-medium text-gray-500">{order.orderedDate}</span>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-600' : 
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 
                    'bg-amber-100 text-amber-700'
                }`}>
                  {order.status || 'Chờ xử lý'}
                </span>
              </div>

              {/* Danh sách món hàng */}
              <div className="space-y-5">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[16px] border border-gray-50 bg-gray-50 dark:border-navy-700 dark:bg-navy-900">
                      <img 
                        src={getImageUrl(item.product?.imageUrl)} 
                        alt="sp" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-lg font-bold font-serif text-[#5C4033] dark:text-white line-clamp-1">
                        {item.product?.productName || "Sản phẩm không xác định"}
                      </span>
                      <span className="text-sm font-bold text-gray-400 mt-1">Số lượng: x{item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-[#5C4033] dark:text-amber-400">
                        {item.subTotal ? item.subTotal.toLocaleString('vi-VN') : 0} <span className="text-sm text-gray-400 underline decoration-gray-300">đ</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng tiền & Footer */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-amber-50/50 p-5 border border-amber-100/50 gap-4 dark:border-navy-700 dark:bg-navy-900/50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-gray-400 mb-1">Phương thức thanh toán</span>
                  <span className="font-bold text-[#5C4033] dark:text-white">
                    {order.paymentMethod === 'VNPAY' ? 'Thẻ / VNPay' : 'Thanh toán khi nhận hàng (COD)'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-sm font-bold uppercase text-gray-500 dark:text-gray-300">Tổng cộng:</span>
                  <span className="text-2xl font-black text-amber-600">
                    {order.total ? order.total.toLocaleString('vi-VN') : 0} <span className="text-base text-gray-400 underline">đ</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}