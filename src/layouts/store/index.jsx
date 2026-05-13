// src/layouts/store/index.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import StoreHome from "views/store/home";
import ProductDetail from "views/store/product";
import StoreCart from "views/store/cart";
import StoreCheckout from "views/store/checkout";
import PaymentReturn from "views/store/payment-return";
import { 
  MdShoppingCart, 
  MdSearch, 
  MdKeyboardArrowDown, 
  MdLocalFireDepartment,
  MdAttachMoney,
  MdCategory
} from "react-icons/md";
import cartApi from "api/cartApi";
import categoryApi from "api/categoryApi"; 

export default function StoreLayout() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); 
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
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
      setCategories(catData || []);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
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

  // Hàm mồi cho tính năng lọc giá (Sẽ xử lý ở trang Home sau)
  const handlePriceClick = (priceRange) => {
    navigate("/", { state: { priceRange: priceRange } });
  };

  useEffect(() => {
    fetchCartCount();
    fetchCategories(); 
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 font-sans">
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm dark:bg-navy-800/90 border-b border-gray-100 dark:border-navy-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-brand-500 dark:text-white tracking-tight">
                Rainbow<span className="text-navy-700 dark:text-gray-300">Forest</span>
              </span>
            </Link>

            {/* 🌟 MEGA MENU (SỬA LẠI Ở ĐÂY) */}
            <div className="group relative hidden lg:block py-2">
              <button className="flex items-center gap-1 rounded-full bg-gray-50 px-4 py-2 text-sm font-bold text-navy-700 transition hover:bg-brand-50 hover:text-brand-500 dark:bg-navy-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-brand-400">
                Khám phá <MdKeyboardArrowDown className="transition-transform group-hover:rotate-180" size={20} />
              </button>
              
              {/* Vùng đệm vô hình */}
              <div className="absolute left-0 top-full h-4 w-full"></div>

              {/* Bảng Mega Menu khổng lồ */}
              <div className="absolute left-0 top-[calc(100%+0.5rem)] invisible w-[800px] origin-top-left translate-y-4 rounded-[24px] bg-white p-8 shadow-2xl shadow-gray-200/50 ring-1 ring-gray-100 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:bg-navy-800 dark:shadow-none dark:ring-white/10 z-[100]">
                <div className="grid grid-cols-3 gap-8">
                  
                  {/* CỘT 1: DANH MỤC */}
                  <div className="flex flex-col">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-white/10">
                      <MdCategory className="text-brand-500" size={20} />
                      <h3 className="text-sm font-black uppercase tracking-wider text-navy-700 dark:text-white">Loại thức uống</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleCategoryClick("ALL")}
                        className="text-left rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-500 hover:pl-6 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-brand-400"
                      >
                        Tất cả sản phẩm
                      </button>
                      {categories.filter(cat => cat.active === 1).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="text-left rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-brand-50 hover:text-brand-500 hover:pl-6 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-brand-400"
                        >
                          {cat.categoryName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CỘT 2: MỨC GIÁ */}
                  <div className="flex flex-col">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-white/10">
                      <MdAttachMoney className="text-green-500" size={20} />
                      <h3 className="text-sm font-black uppercase tracking-wider text-navy-700 dark:text-white">Chọn theo mức giá</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {["Dưới 50.000đ", "Từ 50.000đ - 100.000đ", "Từ 100.000đ - 200.000đ", "Trên 200.000đ"].map((price, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handlePriceClick(idx)}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-brand-500 hover:text-brand-500 dark:border-navy-600 dark:bg-navy-900 dark:text-gray-300 dark:hover:border-brand-400"
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CỘT 3: GỢI Ý & HOT DEALS */}
                  <div className="flex flex-col rounded-2xl bg-brand-50 p-5 dark:bg-navy-900">
                    <div className="mb-4 flex items-center gap-2">
                      <MdLocalFireDepartment className="text-red-500" size={20} />
                      <h3 className="text-sm font-black uppercase tracking-wider text-brand-700 dark:text-white">Góc nổi bật</h3>
                    </div>
                    <Link to="/" onClick={() => handleCategoryClick("ALL")} className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md dark:bg-navy-800">
                      <img 
                        src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400&auto=format&fit=crop" 
                        alt="Hot Deal" 
                        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="p-3 text-center">
                        <p className="text-xs font-bold text-navy-700 dark:text-white">Cà Phê Đặc Sản Mới</p>
                        <p className="text-[10px] text-brand-500 font-bold mt-1">Khám phá ngay &rarr;</p>
                      </div>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
            {/* KẾT THÚC MEGA MENU */}

          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* THANH TÌM KIẾM */}
            <div className="hidden sm:flex items-center rounded-full bg-gray-100 px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-brand-500 dark:bg-navy-900 dark:text-white">
              <MdSearch className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2 w-48 bg-transparent text-sm font-medium outline-none placeholder:text-gray-400 lg:w-64 dark:placeholder:text-gray-500"
              />
            </div>

            {/* GIỎ HÀNG */}
            <Link to="/cart" className="relative flex items-center justify-center rounded-full bg-gray-100 p-2.5 text-navy-700 transition-all hover:bg-gray-200 hover:scale-105 active:scale-95 dark:bg-navy-900 dark:text-white dark:hover:bg-navy-700">
              <MdShoppingCart className="h-[22px] w-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white border-2 border-white dark:border-navy-800 shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* KHU VỰC NÚT AUTH */}
            <div className="hidden md:block">
              {currentUser ? (
                <div className="relative flex items-center">
                    <div 
                        className="flex cursor-pointer items-center gap-2 transition-transform hover:scale-105"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="hidden flex-col items-end sm:flex">
                            <span className="text-sm font-bold text-navy-700 dark:text-white">
                                Chào, <span className="text-brand-500">{currentUser.userName}</span>
                            </span>
                        </div>
                        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-brand-500 shadow-sm">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-12 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 transition-all dark:bg-navy-800 dark:ring-white/10 z-[100]">
                            <div className="flex flex-col gap-1">
                                <Link 
                                    to="#" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                                >
                                    👤 Hồ sơ cá nhân
                                </Link>
                                <div className="my-1 h-px w-full bg-gray-200 dark:bg-white/10"></div>
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
                  className="rounded-full bg-navy-700 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-navy-600 hover:shadow-lg hover:shadow-navy-700/30 active:scale-95 dark:bg-brand-400 dark:hover:bg-brand-300 dark:hover:shadow-brand-400/30"
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
        </Routes>
      </main>
    </div>
  );
}