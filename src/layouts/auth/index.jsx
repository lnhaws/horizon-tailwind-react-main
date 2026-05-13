import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import routes from "routes.js";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return <Route path={`/${prop.path}`} element={prop.component} key={key} />;
      }
      return null;
    });
  };
  document.documentElement.dir = "ltr";
  
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-navy-900 overflow-hidden">
      <FixedPlugin />
      
      {/* Nút quay lại */}
      <Link to="/" className="absolute top-6 left-6 z-50 flex items-center text-sm font-bold text-gray-500 transition hover:text-brand-500">
         <MdKeyboardArrowLeft className="mr-1 h-5 w-5" /> Về trang chủ
      </Link>

      <main className="z-10 flex w-full justify-center px-4">
         <Routes>
           {getRoutes(routes)}
           <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
         </Routes>
      </main>
    </div>
  );
}