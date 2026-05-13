// src/views/admin/tables/components/ProductModal.jsx
import React, { useState, useEffect, useRef } from 'react';

// THÊM PROP `categories` ĐỂ NHẬN DANH SÁCH TỪ TRANG CHÍNH TRUYỀN VÀO
export default function ProductModal({ isOpen, onClose, onSave, editingProduct, categories = [] }) {
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '', // Sửa từ category -> categoryId cho khớp với Backend
    price: 0,
    availability: 0,
    discription: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Tìm ID danh mục đầu tiên đang hoạt động để làm giá trị mặc định
    const firstActiveCategory = categories.find(cat => cat.active === 1)?.id || '';

    if (editingProduct) {
      setFormData({
        productName: editingProduct.productName,
        categoryId: editingProduct.categoryId || firstActiveCategory,
        price: editingProduct.price,
        availability: editingProduct.availability,
        discription: editingProduct.discription || ''
      });

      if (editingProduct.imageUrl) {
        const cleanUrl = editingProduct.imageUrl.startsWith("/") ? editingProduct.imageUrl.slice(1) : editingProduct.imageUrl;
        setImagePreview(`http://localhost:8900/api/catalog/${cleanUrl}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        productName: '',
        categoryId: firstActiveCategory, // Gán mặc định danh mục đầu tiên
        price: 0,
        availability: 0,
        discription: ''
      });
      setImagePreview(null);
    }

    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [editingProduct, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nhớ ép kiểu Number cho categoryId vì thẻ <select> nó hay trả về dạng chuỗi (String)
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'availability' || name === 'categoryId') ? Number(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục sản phẩm!");
      return;
    }
    onSave(formData, imageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-[20px] bg-white p-6 shadow-2xl dark:bg-navy-800">
        <h2 className="mb-4 text-2xl font-bold text-navy-700 dark:text-white">
          {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-navy-700 dark:text-white">Tên Sản Phẩm</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required
              className="mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:border-white/10 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Danh Mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                /* Xóa flex, đổi thành block để chữ hiện to rõ ràng */
                className="mt-1 block h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white/0 px-3 py-2 text-sm outline-none dark:border-white/10 dark:text-white"
              >
                {/* Dùng dấu == thay vì === để đề phòng Backend trả về String '1' thay vì số 1 */}
                {categories.filter(cat => cat.active == 1).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Giá Cố Định (VND)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
                className="mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:border-white/10 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Số Lượng Kho</label>
              <input type="number" name="availability" value={formData.availability} onChange={handleChange} required min="0"
                className="mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:border-white/10 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Tải Ảnh Lên (Tùy chọn)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}
                className="mt-1 flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white/0 px-3 py-1.5 text-sm outline-none dark:border-white/10 dark:text-white" />
            </div>
          </div>

          {imagePreview && (
            <div className="mt-2 flex justify-center">
              <div className="relative h-32 w-32 rounded-xl border-2 border-dashed border-gray-300 p-1">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-navy-700 dark:text-white">Mô Tả</label>
            <textarea name="discription" value={formData.discription} onChange={handleChange} rows="3"
              className="mt-1 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:border-white/10 dark:text-white"></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="rounded-xl px-5 py-2 text-base font-medium text-navy-700 transition duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-white/20">
              Hủy
            </button>
            <button type="submit"
              className="rounded-xl bg-brand-900 px-5 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700">
              Lưu Sản Phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}