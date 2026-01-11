import React, { useEffect, useMemo, useState } from "react";
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

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  // ✅ lock scroll when menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

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
    <nav className="w-full bg-white border-b border-borderColor relative z-[9997]">
      <div
        className="flex items-center justify-between
        px-6 md:px-16 lg:px-24 xl:px-32
        py-5 text-gray-700"
      >
        {/* LOGO */}
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
          <img src={assets.logo} alt="logo" className="h-8" />
        </Link>

        {/* DESKTOP LINKS (>= lg) */}
        <div className="hidden lg:flex items-center gap-10 ml-auto">
          {menuLinks.map((link, index) => {
            const isActive = activePath === link.path;
            return (
              <Link
                key={index}
                to={link.path}
                className={`transition-colors ${
                  isActive ? "text-primary font-medium" : "hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* DESKTOP BUTTONS (>= lg) */}
        <div className="hidden lg:flex items-center gap-4 ml-10">
          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login first");
                setShowLogin(true);
                return;
              }
              if (isOwner) navigate("/owner");
              else changeRole();
            }}
            className="hover:text-primary transition-colors"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={() => (user ? logout() : setShowLogin(true))}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-all"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>

        {/* MOBILE HAMBURGER (< lg) */}
        {!open && (
          <button
            className="lg:hidden cursor-pointer"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <img src={assets.menu_icon} alt="menu" className="w-7" />
          </button>
        )}
      </div>

      {/* ✅ MOBILE FULLSCREEN MENU (Photo1) */}
      {open && (
        <div
          className="fixed inset-0 z-[999999] bg-white"
          style={{
            opacity: 1,
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
        >
          {/* Header */}
          <div className="h-[72px] px-6 flex items-center justify-between border-b border-borderColor">
            <img src={assets.logo} alt="logo" className="h-8" />
            <img
              src={assets.close_icon}
              alt="close"
              className="w-6 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex flex-col gap-6 text-lg">
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`transition-colors ${
                  activePath === link.path
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="my-4" />

            <button
              onClick={() => {
                setOpen(false);

                if (!user) {
                  toast.error("Please login first");
                  setShowLogin(true);
                  return;
                }

                if (isOwner) navigate("/owner");
                else changeRole();
              }}
              className="text-left text-gray-700 hover:text-primary transition-colors"
            >
              {isOwner ? "Dashboard" : "List cars"}
            </button>

            <button
              onClick={() => {
                setOpen(false);
                user ? logout() : setShowLogin(true);
              }}
              className="w-[180px] bg-primary text-white py-3 rounded-lg hover:bg-primary-dull transition-all"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
