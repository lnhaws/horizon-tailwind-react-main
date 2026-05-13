import React, { useState, useEffect } from "react";
import CategoryTable from "./components/CategoryTable";
import CategoryModal from "./components/CategoryModal";
import categoryApi from "api/categoryApi";
import { MdAdd } from "react-icons/md";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Lỗi lấy danh mục", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await categoryApi.addCategory(formData);
        alert("Thêm danh mục mới thành công!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert("Lỗi khi lưu danh mục!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn ẩn danh mục này? (Các sản phẩm bên trong vẫn được giữ lại)")) {
      try {
        await categoryApi.deleteCategory(id);
        alert("Đã ẩn danh mục thành công!");
        fetchCategories();
      } catch (error) {
        alert("Lỗi khi ẩn danh mục!");
      }
    }
  };

  return (
    <div>
      <div className="mt-5 flex justify-end">
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 shadow-lg">
          <MdAdd className="h-6 w-6" /> Thêm Danh Mục Mới
        </button>
      </div>

      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <CategoryTable tableData={categories} onEdit={handleOpenModal} onDelete={handleDelete} />
      </div>

      <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editingCategory={editingCategory} />
    </div>
  );
};

export default CategoriesPage;