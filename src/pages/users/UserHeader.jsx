import React from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
function UserHeader({ onAddUserClick, showForm, searchValue, onSearchChange }) {
    return(
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h3 className="text-[#0ea5e9] dark:text-[#38bdf8] text-xs font-bold tracking-widest uppercase mb-1">User Management</h3>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h2>
            </div>
            <div className="flex w-full md:w-auto gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
          />
        </div>
        <button onClick={onAddUserClick} className="bg-[#0ea5e9] hover:bg-[#0284c7] dark:bg-[#0284c7] dark:hover:bg-[#0369a1] text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap">
          <Plus size={18} />
                 Add User
          <ChevronDown size={16} className={`transition-transform ${showForm ? 'rotate-180' : ''}`} />
        </button>
      </div>
        </div>
    );
}
export default UserHeader;