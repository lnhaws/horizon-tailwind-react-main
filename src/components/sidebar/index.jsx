/* eslint-disable */
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import { MdLogout } from "react-icons/md";
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cartId");
  window.location.href = "/";
};

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        {/* 🌟 ĐÃ SỬA class -> className */}
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Horizon <span className="font-medium">FREE</span> 
        </div>
      </div>
      {/* 🌟 ĐÃ SỬA class -> className */}
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      
      {/* Nav item */}
      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Nút Đăng xuất */}
      <div className="mt-auto px-8 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10 px-2"
        >
          <MdLogout className="h-6 w-6" /> 
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;