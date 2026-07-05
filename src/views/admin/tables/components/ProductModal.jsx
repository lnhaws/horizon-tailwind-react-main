import React, { useState, useEffect, useRef } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';

export default function ProductModal({ isOpen, onClose, onSave, editingProduct, categories = [] }) {
  const [formData, setFormData] = useState({ productName: '', categoryId: '', description: '' });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  
  // 🌟 MẢNG QUẢN LÝ CÁC BIẾN THỂ TRỌNG LƯỢNG
  const [variants, setVariants] = useState([]);
  const mainFileInputRef = useRef(null);

  useEffect(() => {
    const firstActiveCategory = categories.find(cat => cat.active == 1)?.id || '';
    if (editingProduct) {
      setFormData({
        productName: editingProduct.productName,
        categoryId: editingProduct.categoryId || firstActiveCategory,
        description: editingProduct.description || ''
      });
      setImagePreview(editingProduct.imageUrl);

      // Nạp dữ liệu biến thể cũ nếu có (Chưa nạp ảnh preview cho nhẹ form)
      if (editingProduct.variants && editingProduct.variants.length > 0) {
        setVariants(editingProduct.variants.map((v, index) => ({
          ...v,
          tempId: index, // ID tạm để render React List
          imageFile: null 
        })));
      } else {
        setVariants([{ tempId: Date.now(), weight: 250, unit: 'g', price: 0, availability: 0, imageFile: null }]);
      }
    } else {
      setFormData({ productName: '', categoryId: firstActiveCategory, description: '' });
      setImagePreview(null);
      setVariants([{ tempId: Date.now(), weight: 250, unit: 'g', price: 0, availability: 0, imageFile: null }]);
    }
    setMainImageFile(null);
  }, [editingProduct, isOpen, categories]);

  const setImagePreview = (url) => {
    if (!url) { setMainImagePreview(null); return; }
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    setMainImagePreview(`http://localhost:8900/api/catalog/${cleanUrl}`);
  };

  // Các hàm xử lý giao diện
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'categoryId' ? Number(value) : value }));
  };

  const handleMainFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Quản lý Mảng Trọng lượng
  const addVariant = () => {
    setVariants([...variants, { tempId: Date.now(), weight: '', unit: 'g', price: 0, availability: 0, imageFile: null }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVars = [...variants];
    newVars[index][field] = (field === 'price' || field === 'availability' || field === 'weight') ? Number(value) : value;
    setVariants(newVars);
  };

  const updateVariantImage = (index, file) => {
    const newVars = [...variants];
    newVars[index].imageFile = file;
    setVariants(newVars);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (variants.length === 0) { alert("Sản phẩm phải có ít nhất 1 mức trọng lượng!"); return; }
    // Nén cục data gửi ra ngoài cho cha xử lý
    onSave({ ...formData, variants: variants }, mainImageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-[20px] bg-white p-6 shadow-2xl dark:bg-navy-800 my-auto">
        <h2 className="mb-4 text-2xl font-bold text-navy-700 dark:text-white">
          {editingProduct ? 'Chỉnh Sửa Sản Phẩm (Đóng Gói)' : 'Thêm Sản Phẩm Đóng Gói'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* KHU VỰC 1: THÔNG TIN CHUNG & ẢNH GỐC */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-2xl dark:bg-navy-900 border border-gray-100 dark:border-navy-700">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Tên Sản Phẩm (Gốc)</label>
                <input type="text" name="productName" value={formData.productName} onChange={handleMainChange} required className="mt-1 flex h-10 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-navy-700 dark:text-white">Danh Mục</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleMainChange} required className="mt-1 block h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white">
                    {categories.filter(cat => cat.active == 1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Câu chuyện hương vị (Mô tả)</label>
                <textarea name="description" value={formData.description} onChange={handleMainChange} rows="3" className="mt-1 flex w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:border-white/10 dark:bg-navy-800 dark:text-white"></textarea>
              </div>
            </div>

            {/* UP ẢNH GỐC */}
            <div className="flex flex-col items-center justify-center space-y-3 border-l border-gray-200 dark:border-navy-700 pl-4">
              <label className="text-sm font-bold text-navy-700 dark:text-white text-center">Ảnh Đại Diện Gốc</label>
              <div className="relative h-32 w-32 rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center">
                {mainImagePreview ? (
                  <img src={mainImagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : ( <span className="text-xs text-gray-400 text-center px-2">Bấm tải ảnh ở dưới</span> )}
              </div>
              <input type="file" accept="image/*" onChange={handleMainFileChange} ref={mainFileInputRef} className="w-full text-xs" />
            </div>
          </div>

          {/* KHU VỰC 2: DANH SÁCH KHỐI LƯỢNG */}
          <div className="border border-amber-200 bg-amber-50/30 rounded-2xl p-5 dark:bg-navy-900 dark:border-navy-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-amber-700 dark:text-amber-400">Các Mức Trọng Lượng & Giá</h3>
              <button type="button" onClick={addVariant} className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-amber-600">
                <MdAdd size={18} /> Thêm Mức
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {variants.map((v, index) => (
                <div key={v.tempId} className="grid grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm items-center dark:bg-navy-800 dark:border-navy-700">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Trọng lượng</label>
                    <input type="number" value={v.weight} onChange={(e) => updateVariant(index, 'weight', e.target.value)} required className="w-full h-8 px-2 border rounded-md text-sm dark:bg-navy-900 dark:border-navy-600 dark:text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Đơn vị</label>
                    <select value={v.unit} onChange={(e) => updateVariant(index, 'unit', e.target.value)} className="w-full h-8 px-2 border rounded-md text-sm dark:bg-navy-900 dark:border-navy-600 dark:text-white">
                      <option value="g">g (Gram)</option>
                      <option value="kg">kg (Kilogram)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Giá bán (đ)</label>
                    <input type="number" value={v.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} required className="w-full h-8 px-2 border rounded-md text-sm dark:bg-navy-900 dark:border-navy-600 dark:text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Tồn kho</label>
                    <input type="number" value={v.availability} onChange={(e) => updateVariant(index, 'availability', e.target.value)} required className="w-full h-8 px-2 border rounded-md text-sm dark:bg-navy-900 dark:border-navy-600 dark:text-white" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Ảnh bao bì (Tùy chọn)</label>
                    <input type="file" accept="image/*" onChange={(e) => updateVariantImage(index, e.target.files[0])} className="w-full text-[10px] mt-1" />
                  </div>
                  <div className="col-span-1 flex justify-center mt-4">
                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition dark:hover:bg-red-500/10">
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl px-5 py-2 text-base font-medium text-navy-700 transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/20"> Hủy </button>
            <button type="submit" className="rounded-xl bg-brand-900 px-5 py-2 text-base font-medium text-white transition hover:bg-brand-800"> Lưu Cấu Hình Sản Phẩm </button>
          </div>
        </form>
      </div>
    </div>
  );
}