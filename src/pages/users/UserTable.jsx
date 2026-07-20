import React, { useState } from 'react';
import { Users as UsersIcon, Edit2, Check, Trash2, X } from 'lucide-react';
function EditUserModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user?.name || user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || user?.avatarUrl || '');
  const handleSave = () => {
    onSave({
      ...user,
      name: username,
      username: username,
      phone: phone,
      avatar: avatarUrl,
      avatarUrl: avatarUrl,
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={22} /></button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Avatar URL</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] dark:bg-[#0284c7] dark:hover:bg-[#0369a1] text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function UserTable({ users, onUpdateUser, onMakeAdmin, onDeleteUser }) {
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveEdit = (updatedUser) => {
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
  };

  const handleDelete = (user) => {
    const confirmed = window.confirm(`متأكدة إنك عاوزة تمسحي "${user?.name || user?.username}"؟`);
    if (confirmed && onDeleteUser) {
      onDeleteUser(user);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm border-b border-gray-100 dark:border-gray-600">
              <th className="py-4 px-6 font-medium">User</th>
              <th className="py-4 px-6 font-medium">Role</th>
              <th className="py-4 px-6 font-medium">Verified</th>
              <th className="py-4 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={user?._id || index} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-4 px-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center text-white flex-shrink-0">
                     <UsersIcon size={20} />
                  </div>
                  <div>
                  
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{user?.name || user?.username || "Unknown"}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">{user?.email || "No Email"}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${
                    user?.role === 'admin' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300' : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                  }`}>
                    {user?.role || "user"}
                  </span>
                </td>
                <td className="py-4 px-6">
               
                  {user?.verified || user?.isVerified ? (
                    <span className="flex items-center gap-1 text-green-500 dark:text-green-400 text-sm"><Check size={16} /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 dark:text-red-400 text-sm"><X size={16} /> No</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingUser(user)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => onMakeAdmin && onMakeAdmin(user)} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors"><Check size={14} /></button>
                    <button onClick={() => handleDelete(user)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            
         
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400 dark:text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default UserTable;