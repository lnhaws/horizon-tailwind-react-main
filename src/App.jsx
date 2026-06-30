import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import StoreLayout from "layouts/store";
import Collections from 'views/store/collections';

// 🌟 CHỐT BẢO VỆ ADMIN (Phiên bản chính thức: Dùng Role từ Database)
const AdminProtectedRoute = ({ children }) => {
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // 1. Chưa đăng nhập? Mời ra trang Sign-in
  if (!currentUser) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // 2. Kiểm tra xem user này có phải Admin (Role ID = 1) không?
  // Quét các trường hợp tên biến JSON mà Backend có thể trả về xuống LocalStorage
  const isAdmin = 
    currentUser.role_id === 1 || 
    currentUser.roleId === 1 || 
    currentUser.userRole?.id === 1 || 
    currentUser.role?.id === 1 ||
    currentUser.userRole?.roleName?.toLowerCase() === 'admin';

  // Nếu không có thẻ Admin -> Đuổi về trang chủ
  if (!isAdmin) {
    alert("Cảnh báo: Chỉ có Quản trị viên (Admin) mới được phép vào khu vực này!");
    return <Navigate to="/" replace />;
  }

  // 3. Đúng là Admin thì mở cửa cho vào
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      
      <Route 
        path="admin/*" 
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        } 
      />
      
      <Route path="rtl/*" element={<RtlLayout />} />
      
      <Route path="/*" element={<StoreLayout />} />
      
      {/* <Route path="/collections" element={<Collections />} /> */}
    </Routes>
  );
};

export default App;