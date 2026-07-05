import React from "react";
import { Link, useNavigate } from "react-router-dom"; // 🌟 THÊM useNavigate
import { MdAddShoppingCart, MdLocalCafe } from "react-icons/md";

export default function ProductGrid({ filteredProducts, categories, handleAddToCart, getImageUrl }) {
    const navigate = useNavigate(); // 🌟 KHAI BÁO navigate

    // 🌟 HÀM TÍNH KHOẢNG GIÁ
    const getDisplayPrice = (product) => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) return `${minPrice.toLocaleString('vi-VN')} đ`;
            return `${minPrice.toLocaleString('vi-VN')} đ - ${maxPrice.toLocaleString('vi-VN')} đ`;
        }
        return `${(product.price || 0).toLocaleString('vi-VN')} đ`; 
    };

    if (filteredProducts.length === 0) {
        return (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-300 dark:bg-navy-800">
                    <MdLocalCafe size={48} />
                </div>
                <p className="text-2xl font-black text-[#5C4033] dark:text-white mb-2">Không tìm thấy món uống nào.</p>
                <p className="text-base text-gray-500">Bạn thử tìm kiếm với một từ khóa khác xem sao nhé!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col rounded-[24px] bg-white p-4 shadow-sm border border-orange-50/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-200 dark:bg-navy-800 dark:border-navy-700">
                    <Link to={`/product/${product.id}`} className="relative mb-4 h-56 w-full overflow-hidden rounded-[18px] block bg-gray-50 dark:bg-navy-900">
                        <img
                            src={getImageUrl(product.imageUrl)}
                            alt={product.productName}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </Link>

                    <div className="flex flex-1 flex-col justify-between px-1">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-1.5">
                                {categories.find(c => c.id === product.categoryId)?.categoryName || "Đồ uống"}
                            </p>
                            <Link to={`/product/${product.id}`}>
                                <h3 className="text-lg font-bold text-[#5C4033] dark:text-white line-clamp-2 transition-colors group-hover:text-amber-600">
                                    {product.productName}
                                </h3>
                            </Link>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            {/* 🌟 GỌI HÀM getDisplayPrice Ở ĐÂY */}
                            <span className="text-lg font-black text-[#5C4033] dark:text-amber-400">
                                {getDisplayPrice(product)}
                            </span>
                            
                            {/* 🌟 NÚT GIỎ HÀNG: Nếu có biến thể thì chuyển sang trang chi tiết để khách chọn */}
                            <button
                                onClick={() => {
                                    if (product.variants && product.variants.length > 0) {
                                        navigate(`/product/${product.id}`);
                                    } else {
                                        handleAddToCart(product.id);
                                    }
                                }}
                                title="Thêm vào giỏ"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-all duration-300 hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/40 active:scale-90 dark:bg-navy-700 dark:text-white"
                            >
                                <MdAddShoppingCart size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}