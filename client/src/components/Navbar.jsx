import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        setIsOwner(true);
        toast.success("Now you can list cars");
        navigate("/owner");
      } else {
        toast.error(data.message || "Not authorized");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <nav className="w-full bg-sky-50 border-b border-sky-100">
      <div
        className="flex items-center justify-between
        px-6 md:px-16 lg:px-24 xl:px-32
        py-5 text-gray-600 relative"
      >
        {/* ================= LOGO ================= */}
        <Link to="/" onClick={() => setOpen(false)}>
          <img src={assets.logo} alt="logo" className="h-8" />
        </Link>

        {/* ================= MENU + SEARCH (RIGHT SIDE) ================= */}
        <div className="hidden lg:flex items-center gap-8 ml-auto mr-8">
          {/* Menu Links */}
          <div className="flex items-center gap-8">
            {menuLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className={`relative transition-colors ${
                    isActive ? "text-primary font-medium" : "hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div
            className="flex items-center gap-2
            border border-borderColor
            px-4 py-2 rounded-full w-64
            hover:shadow-sm transition-all"
          >
            <input
              type="text"
              placeholder="Search products"
              className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
            />
            <img
              src={assets.search_icon}
              alt="search"
              className="w-4 opacity-70"
            />
          </div>
        </div>

        {/* ================= DASHBOARD + LOGIN ================= */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login first");
                setShowLogin(true);
                return;
              }

              if (isOwner) {
                navigate("/owner");
              } else {
                changeRole();
              }
            }}
            className="hover:text-primary transition-colors"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="px-6 py-2 bg-primary text-white rounded-lg
            hover:bg-primary-dull transition-all"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>

        {/* ================= MOBILE MENU ICON ================= */}
        {!open && (
          <button
            className="sm:hidden cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <img src={assets.menu_icon} alt="menu" className="w-6" />
          </button>
        )}

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`fixed inset-0 bg-white z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
          sm:hidden`}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-10">
              <img src={assets.logo} alt="logo" className="h-8" />
              <img
                src={assets.close_icon}
                alt="close"
                className="w-6 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-6 text-lg">
              {menuLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <hr className="my-8" />

            {/* Mobile Dashboard / List Cars */}
            <button
              onClick={() => {
                setOpen(false);

                if (!user) {
                  toast.error("Please login first");
                  setShowLogin(true);
                  return;
                }

                if (isOwner) {
                  navigate("/owner");
                } else {
                  changeRole();
                }
              }}
              className="text-left hover:text-primary transition-colors mb-6"
            >
              {isOwner ? "Dashboard" : "List cars"}
            </button>

            {/* Mobile Login / Logout */}
            <button
              onClick={() => {
                setOpen(false);
                user ? logout() : setShowLogin(true);
              }}
              className="w-full bg-primary text-white py-3 rounded-lg
              hover:bg-primary-dull transition-all"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
