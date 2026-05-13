import React, { useState, useEffect } from "react";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import userApi from "api/userApi";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getAllUsers();
      // Nếu data bọc trong thuộc tính nào đó của backend (vd: data.content), bạn nhớ trỏ đúng
      setUsers(data); 
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa/khóa tài khoản này?")) {
      try {
        await userApi.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        await userApi.updateUser(editingUser.id, userData);
      } else {
        await userApi.addUser(userData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert("Lỗi khi lưu tài khoản!");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
         {loading ? (
            <div className="text-center py-10 font-bold text-brand-500 animate-pulse">
               Đang tải dữ liệu...
            </div>
         ) : (
            <UserTable 
              tableData={users} 
              onAddClick={() => { setEditingUser(null); setIsModalOpen(true); }}
              onEditClick={(user) => { setEditingUser(user); setIsModalOpen(true); }}
              onDeleteClick={handleDelete}
            />
         )}
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        editingUser={editingUser} 
      />
    </div>
  );
};

export default UsersPage;