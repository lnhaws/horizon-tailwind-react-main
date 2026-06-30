// src/views/store/home/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import productApi from "api/productApi";
import categoryApi from "api/categoryApi";
import cartApi from "api/cartApi";
import LoadingSpinner from "components/loading/LoadingSpinner";
import { MdLocalCafe, MdEco, MdLocalShipping } from "react-icons/md";

import ProductGrid from "./components/ProductGrid";

export default function StoreHome({ searchTerm = "" }) {
    const location = useLocation(); 
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    const getImageUrl = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop"; // Ảnh ly cafe mặc định
        if (url.startsWith("http")) return url;
        const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:8900/api/catalog/${cleanUrl}`;
    };

    useEffect(() => {
        if (location.state && location.state.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory);
        } else {
            setSelectedCategory("ALL"); 
        }
    }, [location.state]);

    useEffect(() => {
        const fetchStoreData = async () => {
            setLoading(true);
            try {
                const catData = await categoryApi.getAllCategories();
                setCategories(catData || []);
                const prodData = await productApi.getAllProducts();
                setProducts(prodData || []);
            } catch (e) { 
                console.log("Lỗi tải dữ liệu", e); 
            }
            setLoading(false);
        };
        fetchStoreData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchCategory = selectedCategory === "ALL" || product.categoryId === selectedCategory;
        const matchSearch = (product.productName || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const handleAddToCart = async (productId) => {
        try {
            await cartApi.addToCart(productId, 1);
            window.dispatchEvent(new Event('cartUpdated'));
            // Thay bằng toast nếu có, alert tạm thời
            alert("☕ Đã thêm món vào giỏ hàng!"); 
        } catch (error) {
            console.error("Lỗi thêm giỏ hàng:", error);
            alert("Lỗi từ hệ thống khi thêm vào giỏ hàng!");
        }
    };

  if (loading) return <LoadingSpinner text="Đang pha chế dữ liệu..." />;

    return (
        <div className="animate-fade-in pb-12">
            
            {/* 🌟 1. BANNER CHÍNH - ĐẬM CHẤT CAFE & TRÀ */}
            <div className="relative mb-12 flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[30px] shadow-2xl">
                {/* Ảnh nền đậm chất Chill */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop')" }}
                />
                {/* Lớp phủ mờ màu nâu đen để làm nổi chữ */}
                <div className="absolute inset-0 bg-[#3e2723]/60 mix-blend-multiply"></div>
                
                {/* Nội dung Banner */}
                <div className="relative z-10 flex flex-col items-center text-center px-4">
                    <h1 className="mb-4 text-4xl font-black text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                        Hương Vị <span className="text-amber-400">Nguyên Bản</span>
                    </h1>
                    <p className="mb-8 max-w-2xl text-lg font-medium text-gray-200 md:text-xl">
                        Bắt đầu ngày mới đầy hứng khởi với những tách cà phê đậm vị và những lá trà thanh mát nhất từ nông trại đến tận tay bạn.
                    </p>
                    <button 
                        onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                        className="rounded-full bg-amber-500 px-8 py-3.5 font-bold text-[#3e2723] shadow-lg transition-all hover:bg-amber-400 hover:scale-105 active:scale-95"
                    >
                        Khám Phá Menu
                    </button>
                </div>
            </div>

            {/* 🌟 2. CAM KẾT CHẤT LƯỢNG (Trust Badges) */}
            <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-[20px] bg-white p-6 text-center shadow-sm border border-orange-50 dark:bg-navy-800 dark:border-navy-700 transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                        <MdLocalCafe size={32} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#5C4033] dark:text-white">Pha Chế Đậm Đà</h3>
                    <p className="text-sm text-gray-500">Hạt cà phê nguyên chất, rang xay thủ công mang lại hương vị khó quên.</p>
                </div>
                
                <div className="flex flex-col items-center rounded-[20px] bg-white p-6 text-center shadow-sm border border-green-50 dark:bg-navy-800 dark:border-navy-700 transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                        <MdEco size={32} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#5C4033] dark:text-white">100% Tự Nhiên</h3>
                    <p className="text-sm text-gray-500">Lá trà hữu cơ được tuyển chọn kỹ lưỡng, thanh mát và tốt cho sức khỏe.</p>
                </div>

                <div className="flex flex-col items-center rounded-[20px] bg-white p-6 text-center shadow-sm border border-blue-50 dark:bg-navy-800 dark:border-navy-700 transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                        <MdLocalShipping size={32} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#5C4033] dark:text-white">Giao Hàng Nhanh</h3>
                    <p className="text-sm text-gray-500">Đảm bảo thức uống luôn tươi mới và nóng hổi khi đến tay bạn.</p>
                </div>
            </div>

            {/* 🌟 3. TIÊU ĐỀ LƯỚI SẢN PHẨM (MENU) */}
            <div className="mb-10 text-center">
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1">Our Menu</p>
                <h2 className="text-3xl font-black text-[#5C4033] dark:text-white capitalize relative inline-block">
                    {selectedCategory === "ALL" 
                        ? "Khám Phá Hương Vị" 
                        : categories.find(c => c.id === selectedCategory)?.categoryName || "Sản phẩm"}
                    {/* Dấu gạch dưới trang trí */}
                    <div className="absolute -bottom-3 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-amber-500"></div>
                </h2>
            </div>

            {/* LƯỚI SẢN PHẨM */}
            <div className="rounded-[20px] bg-white p-4 shadow-sm dark:bg-navy-900 border border-gray-50 dark:border-navy-700">
                <ProductGrid 
                    filteredProducts={filteredProducts} 
                    categories={categories} 
                    handleAddToCart={handleAddToCart}
                    getImageUrl={getImageUrl}
                />
            </div>
        </div>
    );
}