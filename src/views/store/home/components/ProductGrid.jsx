import React from "react";
import { Link } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";

export default function ProductGrid({ filteredProducts, categories, handleAddToCart, getImageUrl }) {
    if (filteredProducts.length === 0) {
        return (
            <div className="col-span-full py-10 text-center text-gray-500 flex flex-col items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486831.png" alt="Not found" className="w-24 h-24 mb-4 opacity-50 grayscale" />
                <p className="text-lg font-semibold">Không tìm thấy sản phẩm nào phù hợp.</p>
                <p className="text-sm">Hãy thử tìm với một từ khóa khác nhé!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col rounded-[20px] bg-white p-4 shadow-sm transition hover:shadow-lg dark:bg-navy-800">
                    <Link to={`/product/${product.id}`} className="relative mb-3 h-48 w-full overflow-hidden rounded-xl block">
                        <img
                            src={getImageUrl(product.imageUrl)}
                            alt={product.productName}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 line-clamp-1">
                                {categories.find(c => c.id === product.categoryId)?.categoryName}
                            </p>
                            <Link to={`/product/${product.id}`}>
                                <h3 className="text-lg font-bold text-navy-700 dark:text-white line-clamp-2 mt-1 hover:text-brand-500 transition">
                                    {product.productName}
                                </h3>
                            </Link>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xl font-extrabold text-brand-500">
                                {product.price ? product.price.toLocaleString('vi-VN') : 0} ₫
                            </span>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition hover:bg-brand-500 hover:text-white dark:bg-white/10 dark:text-white"
                            >
                                <MdAddShoppingCart size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}