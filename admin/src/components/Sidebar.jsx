// in Sidebar file
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets' // ensure this relative path is correct

const Sidebar = () => {
  return (
    <aside className="w-[18%] min-h-screen border-r-2 bg-white">
      <nav className="flex flex-col gap-4 pt-6 pl-6 text-sm">
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-50'}`
          }
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="Add icon" />
          <span className="hidden md:inline">Add Items</span>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-50'}`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="List icon" />
          <span className="hidden md:inline">List Items</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-50'}`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Orders icon" />
          <span className="hidden md:inline">Orders</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
