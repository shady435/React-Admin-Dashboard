import React from 'react'
import { NavLink } from 'react-router-dom'
import { CiHome } from "react-icons/ci";
import { HiUsers } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";
import { FaCube } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { CgNotes } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";
const navItems = [
  { to: '/', label: 'Dashboard', icon: CiHome, end: true },
  { to: '/users', label: 'Users', icon: HiUsers },
  { to: '/products', label: 'Products', icon: FaCube },
  { to: '/addproducts', label: 'Add Product', icon: FaPlus },
  { to: '/orders', label: 'Orders', icon: CgNotes },
  { to: '/carts', label: 'Carts', icon: FaCartShopping },
  { to: '/settings', label: 'Settings', icon: IoSettings },
];
export default function Sidebar() {
  return (
    <ul className="hidden md:flex flex-col bg-white dark:bg-slate-900 shadow-lg gap-2 py-5 text-[#0F172A] dark:text-white font-medium fixed w-[315px] dark:border-r dark:border-slate-800">
      <div>
        <h4 className="ps-6 text-[#55DDF2] text-xs font-medium tracking-[6px]">COMMERCE</h4>
        <h2 className="ps-6 text-[20px] font-medium mb-2 dark:text-white">Admin Panel</h2>
      </div>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <li key={to} className="px-6">
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 w-full rounded-2xl transition-colors ${
                isActive
                  ? 'bg-[#0F172A] text-white dark:bg-cyan-600'
                  : 'text-[#0F172A] hover:bg-[#F1F5F9] dark:text-white dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        </li>
      ))}
      <li>
        <div className="bg-gradient-to-r from-[#17BAEB] to-[#2583E8] mx-5 p-3 px-4 rounded-3xl text-white">
          <h2 className="text-[#BEEDFA] text-xs font-medium">LIVE</h2>
          <h4 className="font-medium">Connected to the E-</h4>
          <h4>commerce API</h4>
        </div>
      </li>
    </ul>
  )
}