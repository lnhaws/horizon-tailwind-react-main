// src/views/store/home/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 🌟 Import useLocation
import productApi from "api/productApi";
import categoryApi from "api/categoryApi";
import cartApi from "api/cartApi";

import HeroBanner from "./components/HeroBanner";
import ProductGrid from "./components/ProductGrid";

export default function StoreHome({ searchTerm = "" }) {
    const location = useLocation(); // Lấy thông tin từ router
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/300";
        if (url.startsWith("http")) return url;
        const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:8900/api/catalog/${cleanUrl}`;
    };

    // 🌟 Lắng nghe thay đổi từ Header (khi click vào menu xổ xuống)
    useEffect(() => {
        if (location.state && location.state.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory);
        } else {
            setSelectedCategory("ALL"); // Mặc định nếu không click gì
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
            alert("Đã thêm vào giỏ hàng thành công!");
        } catch (error) {
            console.error("Lỗi thêm giỏ hàng:", error);
            alert("Lỗi từ hệ thống khi thêm vào giỏ hàng!");
        }
    };

    if (loading) return <div className="py-20 text-center font-bold text-brand-500">Đang tải cửa hàng...</div>;

    return (
        <div className="animate-fade-in pb-10">
            {/* HIỂN THỊ BANNER */}
            <HeroBanner />

            {/* 🌟 ĐÃ XÓA KHU VỰC CHỨA CÁC NÚT DANH MỤC THÔ THIỂN Ở ĐÂY */}
            
            <div className="mb-6 mt-8 flex items-center justify-between">
                <h2 className="text-2xl font-black text-navy-700 dark:text-white border-l-4 border-brand-500 pl-3">
                    {selectedCategory === "ALL" 
                        ? "Tất cả sản phẩm" 
                        : categories.find(c => c.id === selectedCategory)?.categoryName || "Sản phẩm"}
                </h2>
            </div>

            {/* LƯỚI SẢN PHẨM */}
            <ProductGrid 
                filteredProducts={filteredProducts} 
                categories={categories} 
                handleAddToCart={handleAddToCart}
                getImageUrl={getImageUrl}
            />
        </div>
    );
}