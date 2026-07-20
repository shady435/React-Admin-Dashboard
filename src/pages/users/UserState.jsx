import React from 'react';
import { Users as UsersIcon, Shield, UserCheck } from 'lucide-react';
function UserState({ users }) {
  const totalUsers = users?.length || 0;
  const admins = users?.filter(user => user?.role?.toLowerCase() === 'admin').length || 0;
  const customers = users?.filter(user => user?.role?.toLowerCase() === 'customer' || user?.role?.toLowerCase() === 'user').length || 0;
  const verified = users?.filter(user => user?.verified === true || user?.isVerified === true).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft flex justify-between items-center">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-1">Total Users</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</h3>
        </div>
        <div className="bg-[#0ea5e9] dark:bg-[#0284c7] p-3 rounded-xl text-white"><UsersIcon size={24} /></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft flex justify-between items-center">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-1">Admins</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{admins}</h3>
        </div>
        <div className="bg-[#0ea5e9] dark:bg-[#0284c7] p-3 rounded-xl text-white"><Shield size={24} /></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft flex justify-between items-center">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-1">Customers</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{customers}</h3>
        </div>
        <div className="bg-[#0ea5e9] dark:bg-[#0284c7] p-3 rounded-xl text-white"><UsersIcon size={24} /></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft flex justify-between items-center">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-1">Verified</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{verified}</h3>
        </div>
        <div className="bg-[#0ea5e9] dark:bg-[#0284c7] p-3 rounded-xl text-white"><UserCheck size={24} /></div>
      </div>
    </div>
  );
}

export default UserState;