import React from "react";
import MainDashboard from "views/admin/default";
import DataTables from "views/admin/tables";
import UsersPage from "views/admin/users"; 
import OrdersPage from "views/admin/orders";
import CategoriesPage from "views/admin/categories";
import StoreAuth from "views/auth/SignIn"; 

// import BannersPage from "views/admin/banners"; 
// import ProfilePage from "views/admin/profile"; 

import { 
  MdHome, 
  MdBarChart, 
  MdPerson, 
  MdShoppingCart, 
  MdCategory, 
  MdLock, 
  MdImage, 
  MdSettings 
} from "react-icons/md"; 

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Quản lý Đơn hàng", 
    layout: "/admin",
    icon: <MdShoppingCart className="h-6 w-6" />,
    path: "orders",
    component: <OrdersPage />,
  },
  {
    name: "Quản lý Sản phẩm",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Quản lý Danh Mục", 
    layout: "/admin",
    icon: <MdCategory className="h-6 w-6" />,
    path: "categories",
    component: <CategoriesPage />,
  },
  {
    name: "Quản lý Người dùng",
    layout: "/admin",
    icon: <MdPerson className="h-6 w-6" />,
    path: "users",
    component: <UsersPage />,
  },
  // {
  //   name: "Quản lý Banner",
  //   icon: <MdImage className="h-6 w-6" />,
  //   path: "banners",
  //   component: <BannersPage />,
  // },
  // {
  //   name: "Cài đặt & Hồ sơ",
  //   layout: "/admin",
  //   icon: <MdSettings className="h-6 w-6" />,
  //   path: "profile",
  //   component: <ProfilePage />,
  // },
  {
    name: "Đăng nhập",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <StoreAuth />,
  },
];

export default routes;