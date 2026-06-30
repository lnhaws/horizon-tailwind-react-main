import Card from "components/card";
import React from "react";
import { MdRemoveRedEye } from "react-icons/md"; 

export default function OrderTable({ tableData, onStatusChange, onViewDetails }) {
  
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Quản lý Đơn Hàng
        </div>
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">MÃ ĐH</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">KHÁCH HÀNG</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">NGÀY ĐẶT</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TỔNG TIỀN</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">PT THANH TOÁN</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TRẠNG THÁI</th>
              {/* SỬA CHỖ NÀY: Canh lề trái (text-start) thay vì text-center */}
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-navy-800">
                <td className="min-w-[80px] border-white/0 py-3 pr-4 font-bold text-brand-500">#{order.id}</td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4 font-bold text-navy-700 dark:text-white">
                  {order.user?.userName || `User ID: ${order.userId || 'Ẩn danh'}`}
                </td>
                <td className="min-w-[120px] border-white/0 py-3 pr-4 text-sm text-gray-600 dark:text-white">{order.orderedDate}</td>
                <td className="min-w-[120px] border-white/0 py-3 pr-4 font-bold text-navy-700 dark:text-white">
                  {order.total ? order.total.toLocaleString('vi-VN') : 0} ₫
                </td>
                
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 dark:border-white/10 dark:bg-navy-700 dark:text-white">
                    {order.paymentMethod || 'Thanh toán COD'}
                  </span>
                </td>

                <td className="min-w-[140px] border-white/0 py-3 pr-4">
                  <td className="min-w-[140px] border-white/0 py-3 pr-4">
                  <select 
                      className="rounded-lg border border-gray-200 bg-white p-1.5 text-sm font-medium text-navy-700 outline-none transition hover:border-brand-500 dark:bg-navy-700 dark:border-white/10 dark:text-white cursor-pointer"
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value)}
                   >
                     <option value="PENDING">Chờ xử lý</option>
                     <option value="PAID">Đã thanh toán</option> 
                     <option value="SHIPPING">Đang giao hàng</option>
                     <option value="COMPLETED">Đã hoàn thành</option>
                     <option value="CANCELLED">Hủy đơn</option>
                   </select>
                </td>
                </td>

                {/* SỬA CHỖ NÀY: Dùng justify-start để nút dạt về bên trái, ép sát cột trạng thái */}
                <td className="border-white/0 py-3 pr-4">
                   <div className="flex items-center justify-start">
                     <button 
                        onClick={() => onViewDetails(order)}
                        className="flex items-center justify-center rounded-lg bg-brand-50 p-2 text-brand-500 transition duration-200 hover:bg-brand-100 active:bg-brand-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        title="Xem chi tiết đơn hàng"
                     >
                       <MdRemoveRedEye className="h-5 w-5" />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}