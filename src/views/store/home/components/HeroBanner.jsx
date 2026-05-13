import React from "react";

export default function HeroBanner() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const displayName = currentUser?.userName || "Bạn";

    return (
        <div className="relative mb-12 w-full overflow-hidden rounded-[30px] bg-gradient-to-r from-navy-800 to-brand-600 p-8 sm:p-12 lg:p-16 shadow-xl dark:from-navy-900 dark:to-brand-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col items-start max-w-2xl">
                <span className="mb-3 rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    🔥 Bộ sưu tập mùa mới
                </span>
                <h2 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
                    Khám Phá Phong Cách Riêng
                </h2>
                <p className="mb-8 text-lg font-medium text-white/80 sm:text-xl drop-shadow-sm line-clamp-2">
                    Giảm giá lên đến <span className="font-bold text-yellow-300">50%</span> cho các sản phẩm thịnh hành nhất.
                </p>
                <div className="flex gap-4">
                    <button className="rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-navy-800 transition hover:bg-gray-100 hover:scale-105 active:scale-95">
                        Mua Ngay
                    </button>
                    <button className="rounded-full border-2 border-white/30 bg-transparent px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95">
                        Xem Chi Tiết
                    </button>
                </div>
            </div>
        </div>
    );
}