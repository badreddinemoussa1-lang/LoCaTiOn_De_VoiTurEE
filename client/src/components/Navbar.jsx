import React, { useMemo, useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

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

  // ===== Motion variants =====
  const navVariants = {
    hidden: { y: -18, opacity: 0, filter: "blur(6px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 18,
        mass: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -6, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 18 },
    },
  };

  const menuStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  };

  const mobileOverlay = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const mobileDrawer = {
    hidden: { x: "100%" },
    show: {
      x: 0,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
    exit: { x: "100%", transition: { duration: 0.2 } },
  };

  const mobileLink = {
    hidden: { x: 16, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 240, damping: 18 },
    },
  };

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  return (
    <nav className="w-full bg-primary-50 border-b border-primary-100">
      <motion.div
        variants={navVariants}
        initial="hidden"
        animate="show"
        className="flex items-center justify-between
        px-6 md:px-16 lg:px-24 xl:px-32
        py-5 text-gray-600 relative"
      >
        {/* ================= LOGO ================= */}
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
          <motion.img
            variants={itemVariants}
            whileHover={{ scale: 1.12, rotate: -2 }}
            whileTap={{ scale: 0.96, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            src={assets.logo}
            alt="logo"
            className="h-8"
          />
        </Link>

        {/* ================= MENU + SEARCH (RIGHT SIDE) ================= */}
        <div className="hidden lg:flex items-center gap-8 ml-auto mr-8">
          {/* Menu Links */}
          <motion.div
            variants={menuStagger}
            initial="hidden"
            animate="show"
            className="flex items-center gap-8"
          >
            {menuLinks.map((link, index) => {
              const isActive = activePath === link.path;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="relative"
                >
                  <Link
                    to={link.path}
                    className={`relative transition-colors ${
                      isActive ? "text-primary font-medium" : "hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>

                  {/* Animated underline */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="active-underline"
                        initial={{ opacity: 0, scaleX: 0.4 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary rounded-full origin-left"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -1 }}
            className="flex items-center gap-2
              border border-borderColor
              px-4 py-2 rounded-full w-64
              hover:shadow-sm transition-all bg-white/50"
          >
            <input
              type="text"
              placeholder="Search products"
              className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
            />
            <motion.img
              src={assets.search_icon}
              alt="search"
              className="w-4 opacity-70"
              whileHover={{ rotate: 12, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            />
          </motion.div>
        </div>

        {/* ================= DASHBOARD + LOGIN ================= */}
        <motion.div
          variants={menuStagger}
          initial="hidden"
          animate="show"
          className="hidden sm:flex items-center gap-4"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
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
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 16 }}
            onClick={() => (user ? logout() : setShowLogin(true))}
            className="px-6 py-2 bg-primary text-white rounded-lg
            hover:bg-primary-dull transition-all relative overflow-hidden"
          >
            {/* Subtle shine */}
            <motion.span
              aria-hidden="true"
              initial={{ x: "-120%" }}
              whileHover={{ x: "120%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/20 skew-x-[-20deg]"
              style={{ width: "40%" }}
            />
            <span className="relative z-10">{user ? "Logout" : "Login"}</span>
          </motion.button>
        </motion.div>

        {/* ================= MOBILE MENU ICON ================= */}
        {!open && (
          <motion.button
            variants={itemVariants}
            className="sm:hidden cursor-pointer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(true)}
          >
            <img src={assets.menu_icon} alt="menu" className="w-6" />
          </motion.button>
        )}

        {/* ================= MOBILE MENU (Drawer + Backdrop) ================= */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                variants={mobileOverlay}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed inset-0 bg-black/20 z-40 sm:hidden"
                onClick={() => setOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                variants={mobileDrawer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 sm:hidden
                shadow-2xl border-l border-primary-100"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-10">
                    <motion.img
                      src={assets.logo}
                      alt="logo"
                      className="h-8"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    />
                    <motion.img
                      src={assets.close_icon}
                      alt="close"
                      className="w-6 cursor-pointer"
                      whileHover={{ rotate: 90, scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      onClick={() => setOpen(false)}
                    />
                  </div>

                  {/* Mobile Links */}
                  <motion.div
                    variants={menuStagger}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-6 text-lg"
                  >
                    {menuLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        variants={mobileLink}
                        whileHover={{ x: 6 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`hover:text-primary transition-colors ${
                            activePath === link.path ? "text-primary font-medium" : ""
                          }`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.hr
                    initial={{ opacity: 0, scaleX: 0.8 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className="my-8"
                  />

                  {/* Mobile Dashboard / List Cars */}
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
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
                    className="text-left hover:text-primary transition-colors mb-6"
                  >
                    {isOwner ? "Dashboard" : "List cars"}
                  </motion.button>

                  {/* Mobile Login / Logout */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setOpen(false);
                      user ? logout() : setShowLogin(true);
                    }}
                    className="w-full bg-primary text-white py-3 rounded-lg
                    hover:bg-primary-dull transition-all mt-auto"
                  >
                    {user ? "Logout" : "Login"}
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;
