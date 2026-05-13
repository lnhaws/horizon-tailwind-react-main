// src/views/auth/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "api/authApi";
import cartApi from "api/cartApi"; // 🌟 Mới thêm: Import cartApi để gọi hàm gộp
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

export default function StoreAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userPassword: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. GỌI API ĐĂNG NHẬP
      const response = await authApi.login({
        userName: formData.userName,
        userPassword: formData.userPassword
      });

      // Lưu User
      localStorage.setItem("currentUser", JSON.stringify(response));
      alert("Đăng nhập thành công!");

      // 🌟 2. LUỒNG MỚI: GỘP GIỎ HÀNG (MERGE CART) 🌟
      const guestCartId = localStorage.getItem("guestCartId");
      if (guestCartId && response && response.id) {
          try {
              // Gọi API của ông bạn Backend
              await cartApi.mergeCart(guestCartId, response.id);
              // Gộp thành công thì phi tang cái giỏ tạm đi
              localStorage.removeItem("guestCartId");
              console.log("Gộp giỏ hàng Khách vào User thành công!");
          } catch (mergeError) {
              console.error("Lỗi khi gộp giỏ hàng (Bỏ qua để tiếp tục):", mergeError);
          }
      }

      // 3. CẬP NHẬT GIAO DIỆN VÀ CHUYỂN HƯỚNG
      // Gọi event để Navbar tự reload lại số lượng giỏ hàng sau khi gộp
      window.dispatchEvent(new Event('cartUpdated')); 

      const roleName = response.role?.roleName || response.role?.name || "";
      if (roleName.toUpperCase() === "ADMIN" || roleName.toUpperCase() === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errMsg = error.response?.data || "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      alert(errMsg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authApi.register({
        userName: formData.userName,
        userPassword: formData.userPassword,
        email: formData.email,
        active: 1
      });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setIsLogin(true);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data || "Lỗi 500: Server Backend đang gặp trục trặc khi lưu User!";
      alert(`Đăng ký thất bại: ${errMsg}`);
      console.error("Lỗi chi tiết:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md animate-fade-in flex-col justify-center">
      <div className="rounded-[24px] bg-white p-8 shadow-xl shadow-gray-200/50 dark:bg-navy-800 dark:shadow-none border border-gray-100 dark:border-navy-700">

        {/* TIÊU ĐỀ */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-navy-700 dark:text-white mb-2">
            RainbowForest
          </h1>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isLogin ? "Chào mừng bạn quay trở lại hệ thống" : "Tạo tài khoản mới để mua sắm"}
          </h2>
        </div>

        {/* FORM CHÍNH */}
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-navy-700 dark:text-white">Tên đăng nhập</label>
            <input
              type="text" name="userName" value={formData.userName} onChange={handleChange} required
              placeholder="user..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
            />
          </div>

          {!isLogin && (
            <div className="animate-fade-in">
              <label className="mb-1.5 block text-sm font-bold text-navy-700 dark:text-white">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required={!isLogin}
                placeholder="nhuthao@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
              />
            </div>
          )}

          {/* Ô NHẬP MẬT KHẨU CÓ NÚT XEM */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-navy-700 dark:text-white">Mật khẩu</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 pr-12 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 flex items-center justify-center text-gray-400 hover:text-brand-500 transition-colors"
              >
                {showPassword ? (
                  <MdOutlineRemoveRedEye className="h-5 w-5" />
                ) : (
                  <RiEyeCloseLine className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition">Quên mật khẩu?</a>
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-500 py-3.5 text-base font-bold text-white transition hover:bg-brand-600 active:scale-[0.98] shadow-md shadow-brand-500/20"
          >
            {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </button>
        </form>

        {/* NÚT CHUYỂN ĐỔI BÊN DƯỚI */}
        <div className="mt-6 text-center text-sm font-medium text-gray-500">
          {isLogin ? "Bạn chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-500 hover:text-brand-600 font-bold ml-1 transition"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </div>

      </div>
    </div>
  );
}