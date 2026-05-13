// src/views/store/payment-return/index.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import paymentApi from "api/paymentApi";

export default function PaymentReturn() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const verifyPaymentWithBackend = async () => {
            try {
                // 1. Lấy toàn bộ tham số VNPay trả về trên URL (VD: vnp_Amount=...&vnp_ResponseCode=00...)
                const queryString = searchParams.toString();
                const responseCode = searchParams.get("vnp_ResponseCode");

                // 2. Bắn xuống Backend để Backend cập nhật trạng thái đơn hàng trong Database
                await paymentApi.verifyPayment(queryString);

                // 3. Phân loại giao diện hiển thị cho khách
                if (responseCode === "00") {
                    setStatus("success");
                    // (Tùy chọn) Chỉ khi thanh toán thành công mới báo xóa/cập nhật giỏ hàng
                    window.dispatchEvent(new Event('cartUpdated'));
                } else {
                    // Nếu là 24 (Khách hủy) hoặc mã lỗi khác
                    setStatus("failed");
                }
            } catch (error) {
                console.error("Lỗi xác thực thanh toán với Backend:", error);
                setStatus("failed");
            }
        };

        // Chỉ gọi khi có query params từ VNPay trả về
        if (searchParams.toString()) {
            verifyPaymentWithBackend();
        }
    }, [searchParams]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
            <div className="rounded-[20px] bg-white p-10 text-center shadow-xl dark:bg-navy-800 w-full max-w-md">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent mb-4"></div>
                        <h2 className="text-xl font-bold text-navy-700 dark:text-white">Đang xử lý kết quả thanh toán...</h2>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng không đóng trình duyệt!</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-navy-700 dark:text-white mb-2">Thanh toán thành công!</h2>
                        <p className="text-gray-500 mb-6">Cảm ơn bạn đã mua sắm. Đơn hàng đã được thanh toán và đang chuẩn bị.</p>
                        <Link to="/" className="w-full rounded-xl bg-brand-500 py-3 font-bold text-white transition hover:bg-brand-600 block">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                )}

                {status === "failed" && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-navy-700 dark:text-white mb-2">Thanh toán thất bại!</h2>
                        <p className="text-gray-500 mb-6">Bạn đã hủy giao dịch hoặc tài khoản không đủ số dư. Đơn hàng đã bị hủy.</p>
                        <Link to="/cart" className="w-full rounded-xl border-2 border-brand-500 text-brand-500 py-3 font-bold transition hover:bg-brand-50 block">
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}