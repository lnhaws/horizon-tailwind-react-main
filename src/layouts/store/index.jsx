// src/layouts/store/index.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import StoreHome from "views/store/home";
import ProductDetail from "views/store/product";
import StoreCart from "views/store/cart";
import StoreCheckout from "views/store/checkout";
import PaymentReturn from "views/store/payment-return";
import StoreOrders from "views/store/orders"; 
import UserProfile from "views/store/profile"; 
import StoreFooter from "components/footer/StoreFooter";
import { 
  MdShoppingCart, 
  MdSearch, 
  MdKeyboardArrowDown 
} from "react-icons/md";
import cartApi from "api/cartApi";
import categoryApi from "api/categoryApi"; 

export default function StoreLayout() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); 
  
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchCartCount = async () => {
    try {
      const data = await cartApi.getCart();
      if (data && Array.isArray(data)) {
        const total = data.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else { setCartCount(0); }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
          console.error("Lỗi đếm giỏ hàng:", error);
      }
      setCartCount(0);
    }
  };

  const fetchCategories = async () => {
    try {
      const catData = await categoryApi.getAllCategories();
      // 🌟 BỌC THÉP LỚP 1: Ép kiểu mảng
      if (Array.isArray(catData)) {
          setCategories(catData);
      } else {
          setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
      setCategories([]); // Nếu lỗi mạng, ép về mảng rỗng luôn
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cartId");
    window.location.href = "/";
  };

  const handleCategoryClick = (categoryId) => {
    navigate("/", { state: { selectedCategory: categoryId } });
  };

  useEffect(() => {
    fetchCartCount();
    fetchCategories(); 
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 font-sans">
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm dark:bg-navy-800/95 border-b border-gray-100 dark:border-navy-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black font-serif text-[#5C4033] dark:text-white tracking-tight">
                Rainbow<span className="text-amber-500">Forest</span>
              </span>
            </Link>

            <div className="group relative hidden lg:block py-2">
              <button className="flex items-center gap-1 text-sm font-bold text-[#5C4033] transition-colors hover:text-amber-600 dark:text-white dark:hover:text-amber-400">
                Danh mục <MdKeyboardArrowDown className="transition-transform group-hover:rotate-180" size={18} />
              </button>

              <div className="absolute left-0 top-full h-4 w-full"></div>

              <div className="absolute left-0 top-[calc(100%+0.5rem)] invisible w-56 origin-top-left translate-y-2 flex-col rounded-[20px] bg-white p-2 shadow-xl shadow-amber-900/5 ring-1 ring-gray-100 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:bg-navy-800 dark:ring-white/10 z-[100]">
                <button
                  onClick={() => handleCategoryClick("ALL")}
                  className="w-full text-left rounded-xl px-4 py-2.5 text-sm font-bold text-[#5C4033] transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-white dark:hover:bg-white/10"
                >
                  Tất cả thức uống
                </button>
                <div className="my-1 h-px w-full bg-gray-100 dark:bg-white/5"></div>
                
                {/* 🌟 BỌC THÉP LỚP 2: Chắc chắn là mảng mới map() */}
                {(Array.isArray(categories) ? categories : []).filter(cat => cat.active === 1).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 transition-all focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              <MdSearch className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm món uống..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2 w-48 bg-transparent text-sm font-medium text-[#5C4033] outline-none placeholder:text-gray-400 lg:w-64 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <Link to="/cart" className="relative flex items-center justify-center rounded-full bg-amber-50 p-2.5 text-amber-600 transition-all hover:bg-amber-500 hover:text-white hover:scale-105 active:scale-95 dark:bg-navy-900 dark:text-white dark:hover:bg-amber-500">
              <MdShoppingCart className="h-[22px] w-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-navy-800 shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:block">
              {currentUser ? (
                <div className="relative flex items-center">
                    <div 
                        className="flex cursor-pointer items-center gap-2 transition-transform hover:scale-105"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="hidden flex-col items-end sm:flex">
                            <span className="text-sm font-bold text-navy-700 dark:text-white">
                                Chào, <span className="text-amber-500">{currentUser.userName}</span>
                            </span>
                        </div>
                        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-amber-500 shadow-sm">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-12 mt-2 w-56 origin-top-right rounded-[20px] bg-white p-2 shadow-xl shadow-amber-900/10 ring-1 ring-gray-100 transition-all dark:bg-navy-800 dark:ring-white/10 z-[100]">
                            <div className="flex flex-col gap-1">
                                <Link 
                                    to="/profile" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-white dark:hover:bg-white/10"
                                >
                                    👤 Hồ sơ cá nhân
                                </Link>
                                <Link 
                                    to="/orders" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-white dark:hover:bg-white/10"
                                >
                                    📦 Đơn hàng của tôi
                                </Link>
                                <div className="my-1 h-px w-full bg-gray-100 dark:bg-white/10"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    🚪 Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
              ) : (
                <Link
                  to="/auth/sign-in"
                  className="rounded-full bg-[#5C4033] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#3e2723] hover:shadow-lg hover:shadow-[#5C4033]/30 active:scale-95 dark:bg-amber-500 dark:hover:bg-amber-400"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<StoreHome searchTerm={searchTerm} />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<StoreCart />} />
          <Route path="checkout" element={<StoreCheckout />} />
          <Route path="payment-return" element={<PaymentReturn />} />
          <Route path="orders" element={<StoreOrders />} /> 
          <Route path="profile" element={<UserProfile />} /> 
        </Routes>
      </main>
      <StoreFooter />
    </div>
  );
}