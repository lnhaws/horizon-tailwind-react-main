import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

export default function CategoryModal({ isOpen, onClose, onSave, editingCategory }) {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    active: 1 // Mặc định là 1 (Hiển thị)
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.categoryName || '',
        description: editingCategory.description || '',
        active: editingCategory.active !== undefined ? editingCategory.active : 1
      });
    } else {
      setFormData({ categoryName: '', description: '', active: 1 });
    }
  }, [editingCategory, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'active' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-[20px] bg-white p-6 shadow-2xl dark:bg-navy-800 transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
             <MdClose size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-navy-700 dark:text-white">Tên Danh Mục <span className="text-red-500">*</span></label>
            <input type="text" name="categoryName" value={formData.categoryName} onChange={handleChange} required placeholder="Ví dụ: Áo thun nam"
              className="mt-1 flex h-10 w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none transition focus:border-brand-500 dark:border-white/10 dark:text-white" />
          </div>

          <div>
             <label className="text-sm font-bold text-navy-700 dark:text-white">Trạng thái</label>
             <select name="active" value={formData.active} onChange={handleChange}
                className="mt-1 flex h-10 w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none transition focus:border-brand-500 dark:border-white/10 dark:text-white cursor-pointer">
                <option value={1}>Hiển thị</option>
                <option value={0}>Đang ẩn</option>
             </select>
          </div>

          <div>
            <label className="text-sm font-bold text-navy-700 dark:text-white">Mô tả (Tùy chọn)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Nhập mô tả danh mục..."
              className="mt-1 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none transition focus:border-brand-500 dark:border-white/10 dark:text-white"></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={onClose}
              className="rounded-xl px-5 py-2 text-base font-medium text-navy-700 hover:bg-gray-100 transition dark:text-white dark:hover:bg-white/20">
              Hủy
            </button>
            <button type="submit"
              className="rounded-xl bg-brand-900 px-5 py-2 text-base font-medium text-white transition hover:bg-brand-800 active:bg-brand-700">
              Lưu Danh Mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}