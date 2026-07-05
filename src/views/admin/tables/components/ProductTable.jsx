import Card from "components/card";
import React from "react";

export default function ProductTable({ tableData, categories, onAddClick, onEditClick, onDeleteClick }) {
  
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/50";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `http://localhost:8900/api/catalog/${cleanUrl}`;
  };

  const getCategoryName = (id) => {
    if (!categories || categories.length === 0) return "Đang tải...";
    const foundCategory = categories.find((cat) => cat.id === id);
    return foundCategory ? foundCategory.categoryName : "Không xác định";
  };

  // 🌟 HÀM ĐÃ ĐƯỢC NÂNG CẤP: Lấy ra khoảng giá (Min - Max)
  const getDisplayPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
        // Lấy ra tất cả các giá của biến thể
        const prices = product.variants.map(v => v.price);
        
        // Tìm giá nhỏ nhất và lớn nhất
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Nếu giá nhỏ nhất bằng giá lớn nhất (hoặc chỉ có 1 biến thể) -> In 1 giá
        if (minPrice === maxPrice) {
            return `${minPrice.toLocaleString('vi-VN')} đ`;
        }
        
        // Nếu có sự chênh lệch -> In khoảng giá
        return `${minPrice.toLocaleString('vi-VN')} đ - ${maxPrice.toLocaleString('vi-VN')} đ`;
    }
    // Dành cho trường hợp sản phẩm chưa có biến thể
    return `${(product.price || 0).toLocaleString('vi-VN')} đ`; 
  };

  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Danh sách Sản phẩm
        </div>
        <button onClick={onAddClick} className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700">
          + Thêm Sản Phẩm
        </button>
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">HÌNH ẢNH</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">TÊN SẢN PHẨM</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">DANH MỤC</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start text-xs font-bold text-gray-400">MỨC GIÁ</th>
              <th className="border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-center text-xs font-bold text-gray-400">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-navy-800">
                <td className="min-w-[100px] border-white/0 py-3 pr-4">
                  <img src={getImageUrl(product.imageUrl)} alt="product" className="h-12 w-12 rounded-md object-cover border" />
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4 font-bold text-navy-700 dark:text-white">
                  {product.productName}
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4 text-sm text-gray-600 dark:text-white font-medium">
                  <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-navy-700">
                    {getCategoryName(product.categoryId)}
                  </span>
                </td>
                
                {/* 🌟 ĐÃ SỬA LẠI CÁCH GỌI HÀM: Vì hàm getDisplayPrice đã tự format chuỗi và ghép chữ "đ" rồi */}
                <td className="min-w-[150px] border-white/0 py-3 pr-4 font-bold text-brand-500 dark:text-white">
                  {getDisplayPrice(product)}
                </td>

                <td className="min-w-[150px] border-white/0 py-3 pr-4 text-center space-x-2">
                   <button onClick={() => onEditClick(product)} className="text-sm font-bold text-brand-500 hover:text-brand-700 px-3 py-1">Sửa</button>
                   <button onClick={() => onDeleteClick(product.id)} className="text-sm font-bold text-red-500 hover:text-red-700 px-3 py-1">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tableData.length === 0 && <div className="text-center py-6 text-gray-500">Chưa có sản phẩm nào.</div>}
      </div>
    </Card>
  );
}