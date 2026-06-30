import React, { useState, useEffect } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { MdAttachMoney, MdShoppingCart, MdInventory, MdPeople, MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

// Import các API có sẵn
import orderApi from "api/orderApi";
import productApi from "api/productApi";
import userApi from "api/userApi";

const Dashboard = () => {
  // 🌟 KHAI BÁO STATE CHO DỮ LIỆU THẬT
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  // 🌟 GỌI API LẤY DỮ LIỆU THẬT
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [orders, products, users] = await Promise.all([
          orderApi.getAllOrders().catch(() => []), 
          productApi.getAllProducts().catch(() => []),
          userApi.getAllUsers().catch(() => [])
        ]);

        const validOrders = (orders || []).filter(o => o.status !== "CANCELLED");
        const totalRevenue = validOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          revenue: totalRevenue,
          totalOrders: (orders || []).length,
          totalProducts: (products || []).length,
          totalUsers: (users || []).length
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
      }
    };

    fetchRealData();
  }, []);

  return (
    <div>
      {/* 🌟 HÀNG 1: CARD WIDGETS (Kết hợp 4 thẻ Thật + 2 thẻ Ảo cho đủ bộ 6 cái) */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdAttachMoney className="h-7 w-7 text-amber-500" />}
          title={"Tổng Doanh Thu (Thật)"}
          subtitle={`${stats.revenue.toLocaleString('vi-VN')} ₫`}
        />
        <Widget
          icon={<MdShoppingCart className="h-6 w-6 text-amber-500" />}
          title={"Tổng Đơn Hàng (Thật)"}
          subtitle={stats.totalOrders.toString()}
        />
        <Widget
          icon={<MdInventory className="h-7 w-7 text-amber-500" />}
          title={"Tổng Sản Phẩm (Thật)"}
          subtitle={stats.totalProducts.toString()}
        />
        <Widget
          icon={<MdPeople className="h-7 w-7 text-amber-500" />}
          title={"Khách Hàng (Thật)"}
          subtitle={stats.totalUsers.toString()}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Số dư (Mẫu)"}
          subtitle={"$1,000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Truy cập (Mẫu)"}
          subtitle={"145"}
        />
      </div>

      {/* 🌟 HÀNG 2: BIỂU ĐỒ (Dữ liệu mẫu của template) */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* 🌟 HÀNG 3: BẢNG & BIỂU ĐỒ TRÒN (Dữ liệu mẫu của template) */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table */}
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;