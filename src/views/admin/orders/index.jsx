import React, { useState, useEffect } from "react";
import OrderTable from "./components/OrderTable";
import OrderDetailsModal from "./components/OrderDetailsModal"; // 1. IMPORT MODAL VÀO ĐÂY
import orderApi from "api/orderApi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. KHAI BÁO STATE CHO MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data || []); 
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      alert("Cập nhật trạng thái đơn hàng thành công!");
      fetchOrders(); 
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái!");
      console.error(error);
    }
  };

  // 3. HÀM MỞ MODAL
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 4. HÀM ĐÓNG MODAL
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
         {loading ? (
            <div className="text-center py-10 font-bold text-brand-500 animate-pulse">
               Đang tải dữ liệu đơn hàng...
            </div>
         ) : (
            <OrderTable 
              tableData={orders} 
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails} 
            />
         )}
      </div>

      {/* 5. GẮN MODAL XUỐNG CUỐI CÙNG */}
      <OrderDetailsModal 
         isOpen={isModalOpen}
         onClose={handleCloseModal}
         order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPage;