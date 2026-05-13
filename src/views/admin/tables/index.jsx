// src/views/admin/tables/index.jsx
import React, { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import productApi from "api/productApi";
import categoryApi from "api/categoryApi"; // BƯỚC 1: Bắt buộc import API danh mục

const Tables = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // BƯỚC 2: Thêm State chứa danh mục
  const [loading, setLoading] = useState(true);

  // State điều khiển Popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // BƯỚC 3: Cập nhật hàm tải dữ liệu để gọi song song Sản phẩm & Danh mục
  const fetchData = async () => {
    setLoading(true);

    // 1. Gọi API lấy Danh Mục (Nếu lỗi thì set mảng rỗng, không ảnh hưởng thằng dưới)
    try {
      const categoryData = await categoryApi.getAllCategories();
      setCategories(categoryData || []);
    } catch (error) {
      console.log("Không có danh mục nào hoặc lỗi API danh mục.");
      setCategories([]);
    }

    // 2. Gọi API lấy Sản Phẩm (Nếu lỗi 404 vì chưa có SP thì cũng không sao)
    try {
      const productData = await productApi.getAllProducts();
      setProducts(productData || []);
    } catch (error) {
      console.log("Không có sản phẩm nào hoặc lỗi API sản phẩm.");
      setProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // XỬ LÝ XÓA
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productApi.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id)); // Xóa trên giao diện
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // XỬ LÝ LƯU (THÊM HOẶC SỬA) VÀ UPLOAD ẢNH
  const handleSave = async (productData, imageFile) => {
    try {
      let savedProduct;

      // Mình gắn thêm một imageUrl rỗng để tránh lỗi Not Null trong Database
      const finalData = { ...productData, imageUrl: productData.imageUrl || "" };

      // BƯỚC 1: Lưu thông tin chữ
      if (editingProduct) {
        savedProduct = await productApi.updateProduct(editingProduct.id, finalData);
      } else {
        savedProduct = await productApi.addProduct(finalData);
      }

      // BƯỚC 2: Upload ảnh
      if (imageFile && savedProduct && savedProduct.id) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await productApi.uploadImage(savedProduct.id, formData);
      }

      setIsModalOpen(false);
      // Thay vì gọi fetchProducts cũ, giờ mình gọi fetchData để làm mới cả danh mục (nếu cần)
      fetchData(); 
      alert("Lưu sản phẩm thành công!");
    } catch (error) {
      // In lỗi chi tiết ra màn hình
      const errorMsg = error.response?.data?.message || error.response?.data || error.message;
      alert("Lỗi từ Backend: " + JSON.stringify(errorMsg));
      console.error("Chi tiết lỗi:", error);
    }
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        {loading ? (
          <div className="text-center py-10 font-bold text-brand-500 animate-pulse">
            Đang tải dữ liệu sản phẩm và danh mục...
          </div>
        ) : (
          <ProductTable
            tableData={products}
            categories={categories}
            onAddClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            onEditClick={(product) => { setEditingProduct(product); setIsModalOpen(true); }}
            onDeleteClick={handleDelete}
          />
        )}
      </div>

      {/* BƯỚC 4: Truyền danh sách categories vào Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingProduct={editingProduct}
        categories={categories} 
      />
    </div>
  );
};

export default Tables;