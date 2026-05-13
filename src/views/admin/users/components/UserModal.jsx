import React, { useState, useEffect } from 'react';

export default function UserModal({ isOpen, onClose, onSave, editingUser }) {
  // Gộp chung các trường vào một State cho dễ quản lý form
  const [formData, setFormData] = useState({
    userName: '', 
    userPassword: '', 
    active: 1, 
    roleId: 2, // Giả sử 2 là User, 1 là Admin (Tùy data của ông)
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        userName: editingUser.userName || '',
        userPassword: '', 
        active: editingUser.active !== undefined ? editingUser.active : 1,
        roleId: editingUser.role?.id || 2,
        // Lấy dữ liệu từ object lồng userDetails
        firstName: editingUser.userDetails?.firstName || '',
        lastName: editingUser.userDetails?.lastName || '',
        email: editingUser.userDetails?.email || ''
      });
    } else {
      setFormData({ 
        userName: '', userPassword: '', active: 1, roleId: 2, 
        firstName: '', lastName: '', email: '' 
      });
    }
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ĐÓNG GÓI JSON LỒNG NHAU ĐÚNG CHUẨN ENTITY CỦA SPRING BOOT
    const payload = {
      userName: formData.userName,
      userPassword: formData.userPassword,
      active: Number(formData.active),
      role: { id: Number(formData.roleId) },
      userDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      }
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-[20px] bg-white p-6 shadow-2xl dark:bg-navy-800">
        <h2 className="mb-4 text-2xl font-bold text-navy-700 dark:text-white">
          {editingUser ? 'Quản Lý Người Dùng' : 'Thêm Người Dùng Mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thông tin tài khoản */}
          <h3 className="text-lg font-bold text-navy-700 dark:text-white border-b pb-2">Thông tin đăng nhập</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Tên Đăng Nhập</label>
              <input type="text" name="userName" value={formData.userName} onChange={handleChange} required
                disabled={!!editingUser} // Khóa khi sửa
                className={`mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 p-3 text-sm outline-none dark:border-white/10 dark:text-white ${editingUser ? 'bg-gray-100 cursor-not-allowed text-gray-500 dark:bg-navy-700' : 'bg-white/0'}`} />
            </div>
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Mật Khẩu</label>
              <input type="password" name="userPassword" value={formData.userPassword} onChange={handleChange} 
                required={!editingUser} // Thêm mới thì bắt buộc, sửa thì không
                disabled={!!editingUser} // Backend của ông khóa pass rồi nên frontend cũng khóa luôn cho đồng bộ
                placeholder={editingUser ? "Đã khóa bảo mật" : "Nhập mật khẩu"}
                className={`mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 p-3 text-sm outline-none dark:border-white/10 dark:text-white ${editingUser ? 'bg-gray-100 cursor-not-allowed text-gray-500 dark:bg-navy-700' : 'bg-white/0'}`} />
            </div>
          </div>

          {/* Chi tiết người dùng */}
          <h3 className="text-lg font-bold text-navy-700 dark:text-white border-b pb-2 mt-4">Thông tin cá nhân</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Họ (Last Name)</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required={!editingUser} disabled={!!editingUser}
                className={`mt-1 flex h-10 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none ${editingUser ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white/0'}`} />
            </div>
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Tên (First Name)</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required={!editingUser} disabled={!!editingUser}
                className={`mt-1 flex h-10 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none ${editingUser ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white/0'}`} />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-navy-700 dark:text-white">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required={!editingUser} disabled={!!editingUser}
              className={`mt-1 flex h-10 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none ${editingUser ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white/0'}`} />
          </div>

          {/* Phân quyền & Trạng thái */}
          <h3 className="text-lg font-bold text-navy-700 dark:text-white border-b pb-2 mt-4">Phân quyền</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Vai Trò</label>
              <select name="roleId" value={formData.roleId} onChange={handleChange}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:border-white/10 dark:text-white">
                {/* NHỚ ĐỔI SỐ 1 VÀ 2 CHO KHỚP VỚI ID TRONG DATABASE CỦA ÔNG NHÉ */}
                <option value={1}>Admin</option>
                <option value={2}>User</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-navy-700 dark:text-white">Trạng Thái</label>
              <select name="active" value={formData.active} onChange={handleChange}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:border-white/10 dark:text-white">
                <option value={1}>Hoạt động</option>
                <option value={0}>Khóa</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="rounded-xl px-5 py-2 text-base font-medium text-navy-700 transition duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-white/20">
              Hủy
            </button>
            <button type="submit"
              className="rounded-xl bg-brand-900 px-5 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700">
              Lưu Thông Tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}