import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productApi from "api/productApi";
import cartApi from "api/cartApi";
import { 
  MdAddShoppingCart, 
  MdKeyboardArrowLeft, 
  MdVerifiedUser, 
  MdLocalShipping, 
  MdAssignmentReturn,
  MdFlashOn
} from "react-icons/md";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // 🌟 Thêm state lưu SP tương tự
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `http://localhost:8900/api/catalog/${cleanUrl}`;
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // 1. Lấy chi tiết sản phẩm hiện tại
        const data = await productApi.getProductById(id);
        setProduct(data);
        setQuantity(1); // Reset lại số lượng về 1 khi qua sản phẩm mới

        // 2. Lấy danh sách sản phẩm tương tự (cùng danh mục)
        if (data) {
            const allProducts = await productApi.getAllProducts();
            
            // Tìm category ID của sản phẩm hiện tại
            const currentCatId = data.categoryId || data.category?.id;
            
            // Lọc: Cùng Category + Không lấy trùng sản phẩm hiện tại + Chỉ lấy 4 món
            const related = allProducts.filter(p => {
                const pCatId = p.categoryId || p.category?.id;
                return pCatId === currentCatId && p.id !== data.id;
            }).slice(0, 4);
            
            setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm", error);
      }
      setLoading(false);
    };
    
    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 🌟 Cuộn mượt lên đầu trang khi đổi SP
  }, [id]);

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => quantity < product?.availability && setQuantity(quantity + 1);

  const handleAddToCart = async () => {
    try {
      await cartApi.addToCart(product.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleBuyNow = async () => {
    try {
      await cartApi.addToCart(product.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate("/checkout", { state: { selectedItemIds: [product.id] } });
    } catch (error) {
      alert("Lỗi khi xử lý mua ngay");
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
    </div>
  );

  if (!product) return <div className="py-20 text-center font-bold text-red-500">Sản phẩm không tồn tại!</div>;

  return (
    <div className="mx-auto max-w-6xl animate-fade-in pb-20">
      {/* Breadcrumb / Back button */}
      <Link to="/" className="group mb-8 inline-flex items-center text-sm font-bold text-gray-500 transition hover:text-brand-500 dark:text-gray-400">
        <MdKeyboardArrowLeft className="mr-1 h-5 w-5 transition-transform group-hover:-translate-x-1" /> 
        Trở lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* CỘT TRÁI: GALLERY ẢNH */}
        <div className="relative overflow-hidden rounded-[40px] bg-white shadow-xl shadow-gray-200/50 dark:bg-navy-800 dark:shadow-none">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110 aspect-square"
          />
          {product.availability <= 5 && product.availability > 0 && (
            <div className="absolute top-6 left-6 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-black text-white shadow-lg uppercase tracking-wider">
              Sắp hết hàng
            </div>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
        <div className="flex flex-col py-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-lg bg-brand-100 px-3 py-1 text-xs font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 uppercase tracking-widest">
              {product.category?.categoryName || "Premium"}
            </span>
          </div>
          
          <h1 className="text-4xl font-black text-navy-700 dark:text-white lg:text-5xl leading-tight">
            {product.productName}
          </h1>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-black text-brand-500">
              {product.price?.toLocaleString('vi-VN')} ₫
            </span>
            <span className="text-lg text-gray-400 line-through decoration-red-400">
              {(product.price * 1.2).toLocaleString('vi-VN')} ₫
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-navy-900/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "{product.discription?.substring(0, 150) || "Một sản phẩm tuyệt vời đến từ bộ sưu tập mới nhất của chúng tôi."}..."
            </p>
          </div>

          <hr className="my-8 border-gray-100 dark:border-white/10" />

          {/* CHỌN SỐ LƯỢNG */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-black uppercase text-navy-700 dark:text-white">Số lượng</span>
            <div className="flex items-center rounded-2xl border-2 border-gray-100 bg-white p-1.5 dark:border-navy-700 dark:bg-navy-900">
              <button 
                onClick={handleDecrease} 
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold transition hover:bg-gray-100 active:scale-90 dark:text-white dark:hover:bg-white/10"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-black text-navy-700 dark:text-white">
                {quantity}
              </span>
              <button 
                onClick={handleIncrease} 
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold transition hover:bg-gray-100 active:scale-90 dark:text-white dark:hover:bg-white/10"
              >
                +
              </button>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {product.availability} sản phẩm có sẵn
            </span>
          </div>

          {/* NHÓM NÚT ACTION */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={product.availability === 0}
              className="flex flex-[1.5] items-center justify-center gap-3 rounded-2xl border-2 border-brand-500 py-4 text-base font-black text-brand-500 transition-all hover:bg-brand-500 hover:text-white disabled:border-gray-300 disabled:text-gray-300 shadow-xl shadow-brand-500/10"
            >
              <MdAddShoppingCart size={24} /> THÊM VÀO GIỎ
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.availability === 0}
              className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-navy-700 py-4 text-base font-black text-white transition-all hover:bg-navy-800 active:scale-95 disabled:bg-gray-300 shadow-xl shadow-navy-700/20 dark:bg-brand-400 dark:hover:bg-brand-300"
            >
              <MdFlashOn size={24} className="text-yellow-400 group-hover:animate-pulse" /> MUA NGAY
            </button>
          </div>

          {/* CHÍNH SÁCH CAM KẾT */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 dark:border-white/10">
            <div className="flex flex-col items-center text-center">
              <MdVerifiedUser className="mb-2 text-2xl text-green-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">Chính hãng 100%</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-gray-100 dark:border-white/10 px-2">
              <MdLocalShipping className="mb-2 text-2xl text-blue-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">Giao hàng 24h</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <MdAssignmentReturn className="mb-2 text-2xl text-orange-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* TỔNG QUAN MÔ TẢ CHI TIẾT */}
      <div className="mt-16 overflow-hidden rounded-[30px] bg-white shadow-sm dark:bg-navy-800">
        <div className="border-b border-gray-50 px-8 py-6 dark:border-white/5">
          <h2 className="text-2xl font-black text-navy-700 dark:text-white">Mô tả sản phẩm</h2>
        </div>
        <div className="p-8">
          <div className="prose max-w-none text-gray-600 dark:text-gray-300 leading-loose">
            {product.discription ? (
              product.discription.split('\n').map((line, index) => (
                <p key={index} className="mb-4">{line}</p>
              ))
            ) : (
              <p className="italic opacity-50">Sản phẩm này hiện đang được cập nhật thêm thông tin chi tiết từ nhà cung cấp.</p>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 KHU VỰC SẢN PHẨM TƯƠNG TỰ */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-navy-700 dark:text-white border-l-4 border-brand-500 pl-4">
              Sản phẩm tương tự
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {relatedProducts.map(item => (
              <Link 
                key={item.id} 
                to={`/product/${item.id}`} 
                className="group flex flex-col overflow-hidden rounded-[24px] bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-navy-800"
              >
                <div className="relative aspect-square overflow-hidden rounded-[16px] bg-gray-50 dark:bg-navy-900">
                  <img 
                    src={getImageUrl(item.imageUrl)} 
                    alt={item.productName} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  {/* Nút giỏ hàng ảo bay lên khi hover */}
                  <div className="absolute bottom-3 right-3 translate-y-10 rounded-xl bg-white/90 p-2 text-brand-500 opacity-0 shadow-lg backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100 dark:bg-navy-800/90">
                    <MdAddShoppingCart size={20} />
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col justify-between pt-4 pb-2 px-2">
                  <h3 className="text-sm font-bold text-navy-700 line-clamp-2 transition-colors group-hover:text-brand-500 dark:text-white leading-snug">
                    {item.productName}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-brand-500">
                      {item.price?.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}