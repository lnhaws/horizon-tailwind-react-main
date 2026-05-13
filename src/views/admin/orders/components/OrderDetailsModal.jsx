import React from 'react';
import { MdClose } from 'react-icons/md';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  // Hàm format tiền tệ (thêm dấu chấm và chữ ₫)
  const formatPrice = (price) => {
    return price ? price.toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto py-8">
      <div className="w-full max-w-4xl rounded-[20px] bg-white p-6 shadow-2xl dark:bg-navy-800 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
          <div>
             <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
               Chi tiết đơn hàng <span className="text-brand-500">#{order.id}</span>
             </h2>
             <p className="text-sm text-gray-500 mt-1">Ngày đặt: {order.orderedDate}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition dark:text-gray-400 dark:hover:bg-white/10">
             <MdClose size={24} />
          </button>
        </div>

        {/* NỘI DUNG CHÍNH (CÓ THỂ CUỘN NẾU QUÁ DÀI) */}
        <div className="overflow-y-auto pr-2 flex-1 space-y-6">
           
           {/* 1. THÔNG TIN KHÁCH HÀNG & GIAO HÀNG */}
           <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-navy-900">
                 <p className="text-sm font-medium text-gray-500 mb-1">Thông tin khách hàng</p>
                 <p className="text-lg font-bold text-navy-700 dark:text-white">
                    {order.user?.userName || `Mã KH: ${order.userId || 'Khách vãng lai'}`}
                 </p>
                 {order.user?.email && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Email: {order.user.email}</p>}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-navy-900">
                 <p className="text-sm font-medium text-gray-500 mb-1">Phương thức thanh toán</p>
                 <p className="text-lg font-bold text-navy-700 dark:text-white">
                    {order.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}
                 </p>
                 <p className="text-sm text-brand-500 font-medium mt-1">Trạng thái: {order.status}</p>
              </div>
           </div>

           {/* 2. BẢNG DANH SÁCH MÓN HÀNG */}
           <div>
              <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-3">Sản phẩm đã đặt</h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-white/10">
                    <tr>
                      <th className="py-4 px-5 text-sm font-bold text-gray-500">TÊN SẢN PHẨM</th>
                      <th className="py-4 px-5 text-sm font-bold text-gray-500 text-center">ĐƠN GIÁ</th>
                      <th className="py-4 px-5 text-sm font-bold text-gray-500 text-center">SỐ LƯỢNG</th>
                      <th className="py-4 px-5 text-sm font-bold text-gray-500 text-right">THÀNH TIỀN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => {
                        // 1. LẤY CHÍNH XÁC DATA TỪ Item.java & Product.java
                        const itemName = item.product?.productName || 'Sản phẩm không xác định';
                        const itemQty = item.quantity || 0;
                        
                        // 2. TÍNH TOÁN ĐƠN GIÁ (Vì Item.java chỉ lưu subTotal)
                        // Ưu tiên lấy giá gốc từ Product, nếu rỗng thì lấy subTotal chia số lượng
                        const unitPrice = item.product?.price || (itemQty > 0 ? item.subTotal / itemQty : 0);
                        
                        // 3. LẤY TỔNG PHỤ (SubTotal)
                        const subTotal = item.subTotal || 0;

                        return (
                           <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 dark:border-white/10 dark:hover:bg-navy-800/50">
                             <td className="py-4 px-5 font-medium text-navy-700 dark:text-white">
                               {itemName}
                             </td>
                             <td className="py-4 px-5 text-center text-gray-600 dark:text-gray-300">
                               {formatPrice(unitPrice)}
                             </td>
                             <td className="py-4 px-5 text-center font-bold text-navy-700 dark:text-white bg-gray-50/30 dark:bg-navy-900/30">
                               x{itemQty}
                             </td>
                             <td className="py-4 px-5 text-right font-bold text-brand-500">
                               {formatPrice(subTotal)}
                             </td>
                           </tr>
                        );
                      })
                    ) : (
                      <tr>
                         <td colSpan="4" className="py-8 text-center text-gray-500">
                            Hệ thống không tìm thấy chi tiết món hàng cho đơn này.
                         </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>

           {/* 3. TỔNG KẾT TIỀN */}
           <div className="flex justify-end pt-2">
              <div className="w-full sm:w-1/2 md:w-1/3 rounded-2xl bg-brand-50 p-5 dark:bg-navy-900">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tạm tính:</span>
                    <span className="text-sm font-medium text-navy-700 dark:text-white">{formatPrice(order.total)}</span>
                 </div>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                    <span className="text-sm font-medium text-green-500">Miễn phí</span>
                 </div>
                 <div className="flex justify-between items-center border-t border-brand-200 pt-3 dark:border-white/10">
                    <span className="text-lg font-bold text-navy-700 dark:text-white">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-brand-500">
                       {formatPrice(order.total)}
                    </span>
                 </div>
              </div>
           </div>

        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-white/10">
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-6 py-2.5 text-base font-bold text-navy-700 transition hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}