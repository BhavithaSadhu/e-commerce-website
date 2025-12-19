import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const profileRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowProfileMenu(false);
    navigate("/login");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium px-4">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        {["/", "/collection", "/about", "/contact"].map((path, idx) => {
          const labels = ["HOME", "COLLECTION", "ABOUT", "CONTACT"];
          return (
            <li key={idx}>
              <NavLink to={path} className="flex flex-col items-center gap-1">
                <p>{labels[idx]}</p>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Right icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="search"
        />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile"
            onClick={() => {
              if (!token) {
                navigate("/login");
              } else {
                setShowProfileMenu((prev) => !prev);
              }
            }}
          />

          {token && showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 z-30">
              <div className="w-40 bg-white rounded-md shadow-lg border text-gray-600">
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/orders");
                    setShowProfileMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Orders
                </p>
                <p
                  onClick={logout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="cart" />
          <span className="absolute -right-1 -bottom-1 w-4 h-4 text-[10px] leading-4 bg-black text-white rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </Link>

        {/* Mobile menu icon */}
        <button
          onClick={() => setVisible(true)}
          className="w-6 h-6 cursor-pointer sm:hidden"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-40 shadow-lg transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        } w-64`}
      >
        <button
          onClick={() => setVisible(false)}
          className="flex items-center gap-3 p-4 border-b"
        >
          <img
            src={assets.dropdown_icon}
            className="h-4 rotate-180"
            alt="back"
          />
          BACK
        </button>

        <nav className="flex flex-col">
          {["/", "/collection", "/about", "/contact"].map((path, idx) => {
            const labels = ["Home", "Collection", "About", "Contact"];
            return (
              <NavLink
                key={idx}
                to={path}
                className="py-3 pl-6 border-b"
                onClick={() => setVisible(false)}
              >
                {labels[idx]}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Overlay */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black bg-opacity-20 z-30 sm:hidden"
        />
      )}
    </div>
  );
};

export default Navbar;
