// src/views/store/profile/index.jsx
import React, { useState } from "react";
import userApi from "api/userApi";
import { MdOutlinePerson, MdOutlineLocationOn } from "react-icons/md";

export default function UserProfile() {
  const [loading, setLoading] = useState(false);
  
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // Khởi tạo state bằng dữ liệu sẵn có từ localStorage
  const [formData, setFormData] = useState({
    firstName: currentUser?.userDetails?.firstName || "",
    lastName: currentUser?.userDetails?.lastName || "",
    email: currentUser?.userDetails?.email || "",
    phoneNumber: currentUser?.userDetails?.phoneNumber || "",
    streetNumber: currentUser?.userDetails?.streetNumber || "",
    street: currentUser?.userDetails?.street || "",
    locality: currentUser?.userDetails?.locality || "",
    country: currentUser?.userDetails?.country || "Việt Nam",
    zipCode: currentUser?.userDetails?.zipCode || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Gọi API cập nhật xuống Backend
      const response = await userApi.updateProfile(currentUser.id, formData);
      
      // 2. Lưu lại dữ liệu mới vào LocalStorage
      localStorage.setItem("currentUser", JSON.stringify(response));
      
      alert("Cập nhật thông tin cá nhân thành công!");
      window.location.reload(); 
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin! Vui lòng kiểm tra lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <div className="py-20 text-center font-bold text-[#5C4033]">Vui lòng đăng nhập để xem thông tin!</div>;

  return (
    <div className="mx-auto max-w-4xl py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-serif text-[#5C4033] dark:text-white">Thông tin tài khoản</h1>
        <p className="text-gray-500 mt-2">Cập nhật địa chỉ và số điện thoại để hệ thống tự động điền khi thanh toán đơn hàng.</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="rounded-[30px] bg-white p-8 shadow-xl shadow-amber-900/5 dark:bg-navy-800 border border-orange-50 dark:border-navy-700">
        
        {/* THÔNG TIN CƠ BẢN */}
        <h2 className="mb-4 text-lg font-bold font-serif text-[#5C4033] dark:text-white border-b border-gray-100 pb-2 flex items-center gap-2 dark:border-white/10">
            <MdOutlinePerson className="text-amber-500"/> Thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Họ (Last Name)</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Tên (First Name)</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Số điện thoại</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" placeholder="VD: 0912345678" />
            </div>
        </div>

        {/* THÔNG TIN ĐỊA CHỈ */}
        <h2 className="mb-4 text-lg font-bold font-serif text-[#5C4033] dark:text-white border-b border-gray-100 pb-2 flex items-center gap-2 dark:border-white/10">
            <MdOutlineLocationOn className="text-amber-500"/> Sổ địa chỉ giao hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Số nhà / Ngõ</label>
              <input type="text" name="streetNumber" value={formData.streetNumber} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" placeholder="VD: 123A" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Tên đường</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" placeholder="VD: Nguyễn Trãi" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Phường/Xã, Quận/Huyện, Tỉnh/TP</label>
              <input type="text" name="locality" value={formData.locality} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" placeholder="VD: Phường Bến Thành, Quận 1, TP.HCM" />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Quốc gia</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-navy-900 dark:text-white dark:border-navy-600" />
            </div>
        </div>

        <button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-4 rounded-xl bg-[#5C4033] text-sm text-white font-bold transition hover:bg-[#3e2723] active:scale-95 disabled:bg-gray-400 shadow-lg shadow-[#5C4033]/30">
            {loading ? "ĐANG LƯU..." : "LƯU THÔNG TIN"}
        </button>
      </form>
    </div>
  );
}