// src/views/store/checkout/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import orderApi from "api/orderApi";
import cartApi from "api/cartApi";
import paymentApi from "api/paymentApi";
import { MdOutlineLocalShipping, MdPayment } from "react-icons/md";

export default function StoreCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedItemIds } = location.state || { selectedItemIds: [] };
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  
  // 🌟 1. LẤY THÔNG TIN USER TỪ LOCALSTORAGE ĐỂ TỰ ĐỘNG ĐIỀN
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const userDetails = currentUser?.userDetails || {};

  const defaultFullName = [userDetails.lastName, userDetails.firstName].filter(Boolean).join(" ");
  const defaultAddress = [userDetails.streetNumber, userDetails.street, userDetails.locality].filter(Boolean).join(", ");
  
  // 🌟 2. GẮN DỮ LIỆU MẶC ĐỊNH VÀO STATE
  const [shippingInfo, setShippingInfo] = useState({
      fullName: defaultFullName || "",
      phone: userDetails.phoneNumber || "",
      address: defaultAddress || "",
      note: ""
  });

  useEffect(() => {
      if (!selectedItemIds || selectedItemIds.length === 0) {
          navigate("/cart");
          return;
      }
      fetchCartSummary();
  }, []);

  const fetchCartSummary = async () => {
      try {
          const data = await cartApi.getCart();
          const filteredItems = (data || []).filter(item => selectedItemIds.includes(item.product?.id));
          setCartItems(filteredItems);
      } catch (error) {
          console.error("Lỗi lấy giỏ hàng", error);
      }
  };

  const handleInputChange = (e) => {
      setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
      e.preventDefault(); 
      
      if (!currentUser || !currentUser.id) {
          alert("Vui lòng đăng nhập để đặt hàng!");
          navigate("/auth/sign-in");
          return;
      }

      setLoading(true);
      
      const orderPayload = {
          selectedProductIds: selectedItemIds,
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          phoneNumber: shippingInfo.phone, 
          notes: shippingInfo.note,
          paymentMethod: paymentMethod
      };
      
      try {
          // 1. Tạo đơn hàng
          const response = await orderApi.createOrder(currentUser.id, orderPayload);
          const newOrderId = response.id; 
          const orderTotal = response.total; 
          
          window.dispatchEvent(new Event('cartUpdated'));
          
          // 2. Chuyển hướng VNPay hoặc Báo thành công
          if (paymentMethod === "VNPAY") {
              const paymentUrl = await paymentApi.createVnPayUrl(newOrderId, orderTotal);
              if (paymentUrl) {
                  window.location.href = paymentUrl; 
              } else {
                  alert("Lỗi: Không lấy được đường dẫn thanh toán!");
                  navigate("/"); 
              }
          } else {
              alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\nMã đơn hàng của bạn là: #${newOrderId}\nCảm ơn bạn đã mua sắm!`);
              navigate("/orders"); // Đặt xong thì cho bay thẳng sang trang Lịch sử đơn hàng
          }
      } catch (error) {
          console.error("Lỗi đặt hàng:", error);
          alert("Có lỗi xảy ra khi đặt hàng. Vui lòng kiểm tra lại hệ thống!");
      } finally {
          setLoading(false);
      }
  };

  // 🌟 ĐÃ SỬA: Lấy chuẩn subTotal từ Backend để cộng tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-6 flex items-center justify-between">
         <h1 className="text-3xl font-black text-navy-700 dark:text-white">Thanh Toán</h1>
         <Link to="/cart" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition">
            &lt; Quay lại giỏ hàng
         </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN & THANH TOÁN */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
              
              <div className="rounded-[20px] bg-white p-6 shadow-sm border border-gray-100 dark:border-navy-700 dark:bg-navy-800">
                  <div className="flex items-center gap-2 mb-4 text-navy-700 dark:text-white">
                      <MdOutlineLocalShipping className="h-6 w-6 text-brand-500" />
                      <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
                  </div>
                  
                  <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">Họ và tên *</label>
                          <input type="text" name="fullName" value={shippingInfo.fullName} required onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" placeholder="Nhập họ và tên" />
                      </div>
                      <div>
                          <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">Số điện thoại *</label>
                          <input type="tel" name="phone" value={shippingInfo.phone} required onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" placeholder="VD: 0912345678" />
                      </div>
                      <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">Địa chỉ giao hàng chi tiết *</label>
                          <input type="text" name="address" value={shippingInfo.address} required onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP" />
                      </div>
                      <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">Ghi chú cho shipper (Tùy chọn)</label>
                          <textarea name="note" value={shippingInfo.note} rows="2" onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" placeholder="VD: Gọi trước khi giao..."></textarea>
                      </div>
                  </form>
              </div>

              <div className="rounded-[20px] bg-white p-6 shadow-sm border border-gray-100 dark:border-navy-700 dark:bg-navy-800">
                  <div className="flex items-center gap-2 mb-4 text-navy-700 dark:text-white">
                      <MdPayment className="h-6 w-6 text-brand-500" />
                      <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${paymentMethod === 'COD' ? 'border-brand-500 bg-brand-50/50' : 'border-gray-200 hover:border-brand-300'}`}>
                          <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="h-5 w-5 text-brand-500" />
                          <span className="font-bold text-navy-700 dark:text-white">Thanh toán khi nhận hàng (COD)</span>
                      </label>
                      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${paymentMethod === 'VNPAY' ? 'border-brand-500 bg-brand-50/50' : 'border-gray-200 hover:border-brand-300'}`}>
                          <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} className="h-5 w-5 text-brand-500" />
                          <span className="font-bold text-navy-700 dark:text-white">Thanh toán qua VNPay</span>
                      </label>
                  </div>
              </div>

          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG VÀ CHỐT */}
          <div className="w-full lg:w-1/3 flex flex-col">
             <div className="sticky top-24 rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800">
                 <h2 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">Đơn hàng của bạn ({cartItems.length} sản phẩm)</h2>
                 
                 <div className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto pr-2">
                     {cartItems.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-navy-700">
                             <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100">
                                 <img src={item.product?.imageUrl ? `http://localhost:8900/api/catalog/${item.product.imageUrl.replace(/^\//, '')}` : "https://via.placeholder.com/50"} alt="sp" className="h-full w-full object-cover" />
                             </div>
                             <div className="flex flex-1 flex-col">
                                 <span className="line-clamp-1 text-sm font-medium text-navy-700 dark:text-white">{item.product?.productName}</span>
                                 <span className="text-xs text-gray-500">SL: {item.quantity}</span>
                             </div>
                             {/* 🌟 ĐÃ SỬA: Dùng trực tiếp item.subTotal */}
                             <span className="text-sm font-bold text-brand-500">{(item.subTotal || 0).toLocaleString('vi-VN')} ₫</span>
                         </div>
                     ))}
                 </div>

                 <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-navy-700">
                     <div className="flex justify-between">
                         <span className="text-sm text-gray-500">Tạm tính</span>
                         <span className="font-medium text-navy-700 dark:text-white">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-sm text-gray-500">Phí vận chuyển</span>
                         <span className="text-sm font-medium text-green-500">Miễn phí</span>
                     </div>
                 </div>
                 
                 <div className="mb-6 mt-4 flex items-end justify-between border-t border-gray-100 pt-4 dark:border-navy-700">
                   <span className="text-base font-bold text-navy-700 dark:text-white">Tổng thanh toán</span>
                   <span className="text-2xl font-black text-red-500">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                 </div>

                 <button 
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="w-full rounded-xl bg-brand-500 py-3.5 text-base font-bold text-white transition hover:bg-brand-600 shadow-md shadow-brand-500/30 disabled:bg-gray-400 disabled:shadow-none"
                 >
                   {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
                 </button>
             </div>
          </div>

      </div>
    </div>
  );
}