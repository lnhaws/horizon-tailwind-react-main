// src/views/store/collections/index.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import productApi from "api/productApi";
import categoryApi from "api/categoryApi";
import LoadingSpinner from "components/loading/LoadingSpinner";
import { MdFilterList } from "react-icons/md";

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Lấy ID danh mục và Từ khóa tìm kiếm từ thanh URL
  const currentCategoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search"); 

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy danh sách Danh mục cho cột bên trái
  useEffect(() => {
    categoryApi.getAllCategories().then(data => setCategories(data || []));
  }, []);

  // 2. Lấy và lọc sản phẩm mỗi khi URL thay đổi
  useEffect(() => {
    setLoading(true);
    const fetchProducts = currentCategoryId 
      ? productApi.getProductsByCategory(currentCategoryId) 
      : productApi.getAllProducts();

    fetchProducts.then(data => {
      let result = data || [];
      
      // Nếu có gõ từ khóa tìm kiếm thì lọc lại mảng
      if (searchQuery) {
        const lowerSearch = searchQuery.toLowerCase();
        result = result.filter(p => p.productName?.toLowerCase().includes(lowerSearch));
      }
      
      setProducts(result);
      setLoading(false);
    }).catch(err => {
      console.error("Lỗi tải sản phẩm:", err);
      setLoading(false);
    });
  }, [currentCategoryId, searchQuery]);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300";
    return url.startsWith("http") ? url : `http://localhost:8900/api/catalog/${url.replace(/^\//, '')}`;
  };

  // Hàm xử lý khi bấm vào danh mục (sẽ tự động xóa từ khóa tìm kiếm cũ nếu có)
  const handleCategoryClick = (categoryId) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-4 py-8">
      {/* Tiêu đề trang động theo tình huống */}
      <div className="mb-8 border-b border-gray-200 pb-4 dark:border-navy-700">
        <h1 className="text-3xl font-black text-[#5C4033] dark:text-white">
          {searchQuery ? `Kết quả tìm kiếm cho: "${searchQuery}"` : "Tất cả sản phẩm"}
        </h1>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        
        {/* CỘT TRÁI: BỘ LỌC DANH MỤC */}
        <div className="w-full md:w-1/4 shrink-0">
          <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-orange-50 dark:bg-navy-800 dark:border-navy-700">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-navy-700 dark:text-white text-lg border-b border-gray-100 pb-3">
              <MdFilterList className="text-amber-500" /> Danh mục
            </h2>
            
            <ul className="flex flex-col gap-2">
              <li>
                <button 
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition font-medium ${!currentCategoryId && !searchQuery ? 'bg-amber-100 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-700'}`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition font-medium ${Number(currentCategoryId) === cat.id ? 'bg-amber-100 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-700'}`}
                  >
                    {cat.categoryName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: LƯỚI SẢN PHẨM */}
        <div className="flex-1">
          {loading ? (
             <LoadingSpinner text="Đang nạp menu..." />
          ) : products.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl font-bold text-[#5C4033] dark:text-white mb-2">Không tìm thấy món uống nào phù hợp!</p>
                <p className="text-gray-500">Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col rounded-2xl bg-white shadow-sm border border-gray-50 transition hover:-translate-y-1 hover:shadow-xl dark:bg-navy-800 dark:border-navy-700 overflow-hidden">
                  <div className="h-56 w-full overflow-hidden bg-gray-100">
                    <img src={getImageUrl(product.imageUrl)} alt={product.productName} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col p-5">
                    <h3 className="text-lg font-bold text-[#5C4033] dark:text-white line-clamp-2">{product.productName}</h3>
                    <p className="mt-3 text-xl font-black text-amber-600">{product.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}