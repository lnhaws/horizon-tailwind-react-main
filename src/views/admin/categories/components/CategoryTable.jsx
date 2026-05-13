import Card from "components/card";
import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

export default function CategoryTable({ tableData, onEdit, onDelete }) {
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Danh Sách Phân Loại
        </div>
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">MÃ</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TÊN DANH MỤC</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">MÔ TẢ</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TRẠNG THÁI</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-navy-800">
                <td className="min-w-[50px] border-white/0 py-3 pr-4 font-bold text-brand-500">#{cat.id}</td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4 font-bold text-navy-700 dark:text-white">{cat.categoryName}</td>
                <td className="min-w-[200px] border-white/0 py-3 pr-4 text-sm text-gray-600 dark:text-gray-300">
                  {cat.description ? cat.description : <span className="italic text-gray-400">Không có mô tả</span>}
                </td>
                <td className="min-w-[100px] border-white/0 py-3 pr-4">
                  {cat.active === 1 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600">Hiển thị</span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">Đang ẩn</span>
                  )}
                </td>
                <td className="min-w-[100px] border-white/0 py-3 pr-4">
                   <div className="flex items-center gap-2">
                     <button onClick={() => onEdit(cat)} className="rounded-lg bg-blue-50 p-2 text-blue-500 transition hover:bg-blue-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10" title="Sửa">
                       <MdEdit className="h-5 w-5" />
                     </button>
                     <button onClick={() => onDelete(cat.id)} className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100 dark:bg-white/5 dark:hover:bg-red-500/20" title="Ẩn/Xóa danh mục">
                       <MdDelete className="h-5 w-5" />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tableData.length === 0 && <div className="text-center py-6 text-gray-500">Chưa có danh mục nào.</div>}
      </div>
    </Card>
  );
}