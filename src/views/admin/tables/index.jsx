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

 const handleSave = async (productData, mainImageFile) => {
    try {
      let savedProduct;

      // Mình phải xóa field imageFile ra khỏi các variant trước khi gửi API bằng JSON để tránh lỗi
      const cleanVariants = productData.variants.map(v => ({
        id: v.id || null, // Nếu sửa thì có ID, nếu thêm mới thì null
        weight: v.weight,
        unit: v.unit,
        price: v.price,
        availability: v.availability
      }));

      // BƯỚC 1: Lưu thông tin chữ (Cha + Con)
      const finalData = { 
        productName: productData.productName,
        categoryId: productData.categoryId,
        description: productData.description,
        price: 0, 
        availability: 0, 
        
        variants: cleanVariants
      };

      if (editingProduct) {
        savedProduct = await productApi.updateProduct(editingProduct.id, finalData);
      } else {
        savedProduct = await productApi.addProduct(finalData);
      }

      // BƯỚC 2: Upload Ảnh gốc
      if (mainImageFile && savedProduct && savedProduct.id) {
        await productApi.uploadImage(savedProduct.id, mainImageFile); 
      }

      // BƯỚC 3: Mò theo Trọng lượng để Upload Ảnh riêng cho từng Biến thể
      if (savedProduct && savedProduct.variants) {
        for (const frontendVar of productData.variants) {
           if (frontendVar.imageFile) {
               // Dò tìm ID của biến thể này dưới Backend vừa tạo ra (Dựa vào Trọng lượng & Đơn vị)
               const matchedBackendVar = savedProduct.variants.find(
                 v => v.weight === frontendVar.weight && v.unit === frontendVar.unit
               );
               if (matchedBackendVar) {
                   await productApi.uploadVariantImage(matchedBackendVar.id, frontendVar.imageFile);
               }
           }
        }
      }

      setIsModalOpen(false);
      fetchData(); 
      alert("Lưu sản phẩm thành công!");
    } catch (error) {
      alert("Lỗi từ Backend, vui lòng kiểm tra Console!");
      console.error(error);
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