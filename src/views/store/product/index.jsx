import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productApi from "api/productApi";
import cartApi from "api/cartApi";
import categoryApi from "api/categoryApi";
import LoadingSpinner from "components/loading/LoadingSpinner";
import { MdAddShoppingCart, MdKeyboardArrowLeft, MdLocalCafe, MdFlashOn } from "react-icons/md";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(""); 
  
  const [selectedVariant, setSelectedVariant] = useState(null);

  const getImageUrl = (url) => {
    if (!url || url === "null" || url === "undefined") return "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `http://localhost:8900/api/catalog/${cleanUrl}`;
  };

  const renderRelatedPrice = (item) => {
    if (item.variants && item.variants.length > 0) {
      const minPrice = Math.min(...item.variants.map(v => v.price));
      return (
        <>
          {minPrice.toLocaleString('vi-VN')} <span className="text-sm font-bold text-gray-400 underline decoration-gray-300">đ</span>
        </>
      );
    }
    return (
      <>
        {(item.price || 0).toLocaleString('vi-VN')} <span className="text-sm font-bold text-gray-400 underline decoration-gray-300">đ</span>
      </>
    );
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductById(id);
        
        if (data) {
            if (data.variants && data.variants.length > 0) {
              const sortedVariants = [...data.variants].sort((a, b) => {
                const weightA = a.unit === 'kg' ? a.weight * 1000 : a.weight;
                const weightB = b.unit === 'kg' ? b.weight * 1000 : b.weight;
                return weightA - weightB;
              });
              data.variants = sortedVariants;
            }
            
            setSelectedVariant(null);
            setProduct(data);
            setQuantity(1); 

            const currentCatId = data.categoryId || data.category?.id;
            if (currentCatId) {
                try {
                    const related = await productApi.getRelatedProducts(currentCatId, data.id);
                    setRelatedProducts(related || []);
                } catch (err) {}
            }

            if (data.categoryId) {
                try {
                    const categories = await categoryApi.getAllCategories();
                    const matchedCat = categories.find(c => c.id === data.categoryId);
                    if (matchedCat) setCategoryName(matchedCat.categoryName);
                } catch (catError) {}
            }
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm", error);
      }
      setLoading(false);
    };
    
    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [id]);

  const hasVariants = product?.variants && product.variants.length > 0;

  const currentPrice = selectedVariant ? selectedVariant.price : (hasVariants ? product.variants[0].price : (product?.price || 0));
  const currentAvailability = selectedVariant ? selectedVariant.availability : (hasVariants ? 1 : (product?.availability || 0));
  const currentImage = (selectedVariant && selectedVariant.imageUrl) ? selectedVariant.imageUrl : product?.imageUrl;

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => quantity < currentAvailability && setQuantity(quantity + 1);

  const handleAddToCart = async () => {
    if (hasVariants && !selectedVariant) {
      alert("⚠️ Vui lòng chọn khối lượng trước khi thêm vào giỏ hàng!");
      return;
    }

    try {
      const variantId = selectedVariant ? selectedVariant.id : null;

      // 🌟 KẾT GIỚI BẢO VỆ KHO: Kiểm tra số lượng đang "ngậm" trong giỏ
      const currentCart = await cartApi.getCart();
      const existingItem = (currentCart || []).find(item => item.product?.id === product.id && item.variantId === variantId);
      const existingQty = existingItem ? existingItem.quantity : 0;

      if (existingQty + quantity > currentAvailability) {
        alert(`⚠️ Rất tiếc! Giỏ hàng của bạn đã có sẵn ${existingQty} gói. Kho hiện chỉ còn ${currentAvailability} gói, không thể thêm nữa!`);
        return;
      }

      await cartApi.addToCart(product.id, variantId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`☕ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleBuyNow = async () => {
    if (hasVariants && !selectedVariant) {
      alert("⚠️ Vui lòng chọn khối lượng trước khi đặt mua!");
      return;
    }

    try {
      const variantId = selectedVariant ? selectedVariant.id : null;

      const currentCart = await cartApi.getCart();
      const existingItem = (currentCart || []).find(item => item.product?.id === product.id && item.variantId === variantId);
      const existingQty = existingItem ? existingItem.quantity : 0;

      if (existingQty + quantity > currentAvailability) {
        alert(`⚠️ Rất tiếc! Giỏ hàng của bạn đã có sẵn ${existingQty} gói. Kho hiện chỉ còn ${currentAvailability} gói!`);
        return; 
      }

      await cartApi.addToCart(product.id, variantId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate("/checkout", { state: { selectedItemIds: [product.id] } });
    } catch (error) {
      alert("Lỗi khi xử lý mua ngay");
    }
  };

  if (loading) return <LoadingSpinner text="Đang pha chế dữ liệu..." />;
  if (!product) return (
    <div className="py-20 text-center font-bold text-red-500 flex flex-col items-center justify-center">
        <MdLocalCafe size={64} className="mb-4 text-gray-300" />
        <p>Sản phẩm này không tồn tại hoặc đã hết hàng!</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl animate-fade-in pb-20">
      <Link to="/" className="group mb-8 inline-flex items-center text-sm font-bold text-gray-500 transition hover:text-amber-600">
        <MdKeyboardArrowLeft className="mr-1 h-5 w-5 transition-transform group-hover:-translate-x-1" /> Trở lại Menu
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[40px] bg-white shadow-2xl border border-orange-50">
          <img src={getImageUrl(currentImage)} alt={product.productName} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110 aspect-square" />
          {currentAvailability <= 5 && currentAvailability > 0 && selectedVariant && (
            <div className="absolute top-6 left-6 rounded-full bg-red-500 px-5 py-2 text-xs font-black text-white shadow-lg uppercase tracking-widest">
              Sắp hết nguyên liệu
            </div>
          )}
        </div>

        <div className="flex flex-col py-2">
          {categoryName && (
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-black text-amber-600 uppercase tracking-widest">
                {categoryName}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl font-black text-[#5C4033] lg:text-5xl leading-tight">
            {product.productName}
          </h1>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-black text-[#5C4033]">
              {currentPrice.toLocaleString('vi-VN')} <span className="text-2xl font-bold text-gray-400 ml-1.5 underline decoration-gray-300">đ</span>
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-amber-50/50 p-5 border-l-4 border-amber-500">
            <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
              "{product.description?.substring(0, 150) || "Hương vị nguyên bản được pha chế tỉ mỉ từ những nguyên liệu chọn lọc nhất..."}..."
            </p>
          </div>

          <hr className="my-8 border-gray-100" />

          {hasVariants && (
            <div className="mb-8">
              <span className="text-sm font-black uppercase tracking-widest text-[#5C4033] mb-4 block">Chọn Trọng Lượng</span>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1); 
                    }}
                    className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all border-2 ${
                      selectedVariant?.id === variant.id 
                        ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300'
                    }`}
                  >
                    {variant.weight}{variant.unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6">
            <span className="text-sm font-black uppercase tracking-widest text-[#5C4033]">Số lượng</span>
            <div className="flex items-center rounded-2xl border-2 border-amber-100 bg-white p-1.5 shadow-sm">
              <button onClick={handleDecrease} className="flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold text-[#5C4033] hover:bg-amber-50">-</button>
              <span className="w-12 text-center text-lg font-black text-[#5C4033]">{quantity}</span>
              <button onClick={handleIncrease} className="flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold text-[#5C4033] hover:bg-amber-50">+</button>
            </div>
            {hasVariants && !selectedVariant ? (
               <span className="text-xs font-bold text-amber-600/70">
                 Vui lòng chọn trọng lượng để xem tồn kho
               </span>
            ) : (
               <span className="text-xs font-bold text-amber-600/70">
                 Chỉ còn {currentAvailability} túi trong kho
               </span>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button onClick={handleAddToCart} disabled={currentAvailability === 0 && (!hasVariants || selectedVariant)} className="flex flex-[1.5] items-center justify-center gap-3 rounded-2xl border-2 border-amber-500 bg-white py-4 text-base font-black text-amber-600 hover:bg-amber-500 hover:text-white disabled:border-gray-300 disabled:text-gray-300">
              <MdAddShoppingCart size={24} /> THÊM VÀO GIỎ
            </button>
            <button onClick={handleBuyNow} disabled={currentAvailability === 0 && (!hasVariants || selectedVariant)} className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#5C4033] py-4 text-base font-black text-white hover:bg-[#3e2723] disabled:bg-gray-300">
              <MdFlashOn size={24} className="text-amber-400" /> MUA NGAY
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-hidden rounded-[40px] bg-white shadow-sm border border-orange-50 dark:bg-navy-800 dark:border-navy-700">
        <div className="border-b border-gray-50 px-10 py-8 dark:border-white/5 bg-amber-50/30 dark:bg-navy-900/30">
          <h2 className="text-2xl font-black text-[#5C4033] dark:text-white flex items-center gap-3">
            <MdLocalCafe className="text-amber-500"/> Câu chuyện hương vị
          </h2>
        </div>
        <div className="p-10">
          <div className="prose max-w-none text-gray-600 dark:text-gray-300 leading-loose text-lg">
            {product.description ? (
              product.description.split('\n').map((line, index) => (
                <p key={index} className="mb-5">{line}</p>
              ))
            ) : (
              <p className="italic opacity-50">Sản phẩm này hiện đang được các Barista của chúng tôi cập nhật thêm thông tin chi tiết.</p>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="mb-10 flex items-center justify-between text-center w-full">
            <div className="w-full">
              <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Thưởng thức thêm</p>
              <h2 className="text-3xl font-black text-[#5C4033] dark:text-white">Gợi ý cho bạn</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {relatedProducts.map(item => (
              <Link key={item.id} to={`/product/${item.id}`} className="group flex flex-col overflow-hidden rounded-[24px] bg-white p-3 shadow-sm border border-orange-50/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-200 dark:bg-navy-800 dark:border-navy-700">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gray-50 dark:bg-navy-900">
                  <img src={getImageUrl(item.imageUrl)} alt={item.productName} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="absolute bottom-3 right-3 translate-y-10 rounded-full bg-white p-3 text-amber-500 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white dark:bg-navy-800">
                    <MdAddShoppingCart size={22} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between pt-4 pb-2 px-2">
                  <h3 className="text-base font-bold text-[#5C4033] line-clamp-2 transition-colors group-hover:text-amber-600 dark:text-white leading-snug">
                    {item.productName}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-[#5C4033] dark:text-amber-400">
                      {renderRelatedPrice(item)}
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