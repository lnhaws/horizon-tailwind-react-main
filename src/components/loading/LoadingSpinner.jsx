import React from "react";

// Biến { text } giúp ông tùy biến dòng chữ thông báo hiển thị
const LoadingSpinner = ({ text = "Đang tải dữ liệu..." }) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 w-full">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-[#5C4033]"></div>
      <p className="font-bold text-[#5C4033] animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;