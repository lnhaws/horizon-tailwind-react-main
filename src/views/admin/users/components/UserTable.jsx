import Card from "components/card";
import React from "react";

export default function UserTable({ tableData, onAddClick, onEditClick, onDeleteClick }) {
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Danh sách Người dùng
        </div>
        <button onClick={onAddClick} className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700">
          + Thêm Tài Khoản
        </button>
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">ID</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TÊN ĐĂNG NHẬP</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">EMAIL</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">VAI TRÒ</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TRẠNG THÁI</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-navy-800">
                <td className="min-w-[50px] border-white/0 py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white">#{index + 1}</td>
                
                {/* Đổi thành userName */}
                <td className="min-w-[150px] border-white/0 py-3 pr-4 font-bold text-navy-700 dark:text-white">{user.userName}</td>
                
                {/* Lấy email từ trong userDetails (Dùng dấu ? để tránh lỗi nếu userDetails bị null) */}
                <td className="min-w-[200px] border-white/0 py-3 pr-4 text-sm text-gray-600 dark:text-white">
                  {user.userDetails?.email || 'Chưa cập nhật'}
                </td>
                
                {/* Lấy tên role từ Object role */}
                <td className="min-w-[100px] border-white/0 py-3 pr-4">
                  <span className="rounded-full px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600">
                    {user.role?.roleName || 'User'} 
                  </span>
                </td>

                {/* Kiểm tra biến active (1 là hoạt động, 0 là khóa) */}
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <span className={`text-sm font-bold ${user.active === 1 ? 'text-green-500' : 'text-red-500'}`}>
                    {user.active === 1 ? '● Hoạt động' : '● Đã khóa'}
                  </span>
                </td>
                
                <td className="min-w-[150px] border-white/0 py-3 pr-4 space-x-2">
                   <button onClick={() => onEditClick(user)} className="text-sm font-bold text-brand-500 hover:text-brand-700 px-2 py-1">Sửa</button>
                   <button onClick={() => onDeleteClick(user.id)} className="text-sm font-bold text-red-500 hover:text-red-700 px-2 py-1">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}