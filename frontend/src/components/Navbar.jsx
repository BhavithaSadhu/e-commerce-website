import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {setShowSearch , getCartCount} = useContext(ShopContext)
  return (
    <div className="flex items-center justify-between py-5 font-medium px-4">
      {/* Logo */}
      <Link to='/'><img src={assets.logo} className="w-36" alt="logo" /></Link>

      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        <li>
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-1/2 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/collection" className="flex flex-col items-center gap-1">
            <p>COLLECTION</p>
            <hr className="w-1/2 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-1/2 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-1/2 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>
      </ul>

      {/* Right side (icons) */}
      <div className="flex items-center gap-6">
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="search" />

        {/* Profile with dropdown (hover) */}
        <div className="relative group">
          <Link to='/login'><img src={assets.profile_icon} className="w-5 cursor-pointer" alt="profile" /></Link>

          <div className="hidden group-hover:block absolute right-0 top-full mt-1 z-20">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>

        {/* Cart icon + badge */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="cart" />
          <span className="absolute -right-1 -bottom-1 w-4 h-4 text-[10px] leading-4 bg-black text-white rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </Link>

        {/* Mobile menu icon (visible only on small screens) */}
        <button
          onClick={() => setVisible(true)}
          className="w-6 h-6 cursor-pointer sm:hidden p-0"
          aria-label="Open menu"
        >
          <img src={assets.menu_icon} className="w-full h-full" alt="menu" />
        </button>
      </div>

      {/* Mobile sliding sidebar */}
      {/* Use translate-x-full to hide and translate-x-0 to show for smooth animation */}
      <div
        // fixed so it overlays the page; z-40 to be above content
        className={`fixed top-0 right-0 h-full z-40 bg-white shadow-lg transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        } w-64`}
        aria-hidden={!visible}
      >
        <div className="flex flex-col h-full text-gray-600">
          {/* Back / Close */}
          <button
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-4 border-b"
            aria-label="Close menu"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="back" />
            <span className="font-medium">BACK</span>
          </button>

          {/* Mobile links (each closes the sidebar on click) */}
          <nav className="flex flex-col mt-2">
            <NavLink
              to="/"
              className="py-3 pl-6 border-b"
              onClick={() => setVisible(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/collection"
              className="py-3 pl-6 border-b"
              onClick={() => setVisible(false)}
            >
              Collection
            </NavLink>

            <NavLink
              to="/about"
              className="py-3 pl-6 border-b"
              onClick={() => setVisible(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className="py-3 pl-6 border-b"
              onClick={() => setVisible(false)}
            >
              Contact
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Overlay behind sidebar (click to close) */}
      {visible && (
        <button
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black bg-opacity-20 z-30 sm:hidden"
          aria-label="Close overlay"
        />
      )}
    </div>
  );
};

export default Navbar;
