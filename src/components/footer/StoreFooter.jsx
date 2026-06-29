// src/components/footer/StoreFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdPhone, MdEmail, MdLocalCafe } from "react-icons/md";

export default function StoreFooter() {
  return (
    <footer className="bg-[#3e2723] pt-16 pb-8 text-amber-50 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* CỘT 1: THƯƠNG HIỆU */}
          <div className="flex flex-col">
            <Link to="/" className="mb-6 flex items-center gap-2">
              <MdLocalCafe className="text-amber-500" size={32} />
              <span className="text-3xl font-black font-serif text-white tracking-tight">
                Rainbow<span className="text-amber-500">Forest</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-amber-100/70">
              Khơi nguồn cảm hứng từ những hạt cà phê nguyên chất và lá trà thanh mát. Chúng tôi cam kết mang đến cho bạn những thức uống trọn vị, an lành và chất lượng nhất.
            </p>
          </div>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <div>
            <h3 className="mb-6 text-lg font-bold font-serif text-white">Khám phá</h3>
            <ul className="flex flex-col space-y-3 text-sm text-amber-100/70">
              <li><Link to="/" className="transition-colors hover:text-amber-400 hover:underline underline-offset-4">Trang chủ</Link></li>
              <li><Link to="/" className="transition-colors hover:text-amber-400 hover:underline underline-offset-4">Thực đơn đồ uống</Link></li>
              <li><Link to="/profile" className="transition-colors hover:text-amber-400 hover:underline underline-offset-4">Hồ sơ cá nhân</Link></li>
              <li><Link to="/orders" className="transition-colors hover:text-amber-400 hover:underline underline-offset-4">Lịch sử đơn hàng</Link></li>
            </ul>
          </div>

          {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
          <div>
            <h3 className="mb-6 text-lg font-bold font-serif text-white">Liên hệ</h3>
            <ul className="flex flex-col space-y-4 text-sm text-amber-100/70">
              <li className="flex items-start gap-3">
                <MdLocationOn className="mt-0.5 text-amber-500 shrink-0" size={20} />
                <span className="leading-relaxed">123 Đường Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="text-amber-500 shrink-0" size={20} />
                <span>0912 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="text-amber-500 shrink-0" size={20} />
                <span>cskh@rainbowforest.com</span>
              </li>
            </ul>
          </div>

          {/* CỘT 4: GIỜ MỞ CỬA */}
          <div>
            <h3 className="mb-6 text-lg font-bold font-serif text-white">Giờ mở cửa</h3>
            <div className="flex flex-col space-y-3 text-sm text-amber-100/70">
              <div className="flex justify-between border-b border-amber-500/20 pb-2">
                <span>Thứ 2 - Thứ 6:</span>
                <span className="font-bold text-amber-400">07:00 - 22:30</span>
              </div>
              <div className="flex justify-between border-b border-amber-500/20 pb-2">
                <span>Thứ 7 - Chủ Nhật:</span>
                <span className="font-bold text-amber-400">07:30 - 23:00</span>
              </div>
              <p className="mt-4 italic text-amber-500">Sẵn sàng phục vụ bạn mọi lúc!</p>
            </div>
          </div>

        </div>

        {/* PHẦN ĐÁY FOOTER (COPYRIGHT) */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-amber-500/20 pt-8 sm:flex-row">
          <p className="text-sm text-amber-100/50">
            &copy; {new Date().getFullYear()} RainbowForest Coffee & Tea. All rights reserved.
          </p>
          <div className="mt-4 flex gap-3 sm:mt-0">
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 transition-all hover:bg-amber-500 hover:text-[#3e2723] hover:scale-110">
              <span className="font-black text-xs">FB</span>
            </a>
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 transition-all hover:bg-amber-500 hover:text-[#3e2723] hover:scale-110">
              <span className="font-black text-xs">IG</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}