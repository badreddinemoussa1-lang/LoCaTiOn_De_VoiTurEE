import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Banner = () => {
  const { setShowLogin, user, isOwner, axios, setIsOwner, navigate } =
    useAppContext();

  const ADD_CAR_ROUTE = "/owner/add-car"; // ✅ change if your route is different

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        setIsOwner(true);
        toast.success("Now you can list cars");
        navigate(ADD_CAR_ROUTE); // ✅ go directly to add-car
      } else {
        toast.error(data.message || "Not authorized");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleListCarClick = () => {
    if (!user) {
      toast.error("Please login first");
      setShowLogin(true);
      return;
    }

    if (isOwner) {
      navigate(ADD_CAR_ROUTE); // ✅ direct to add-car
    } else {
      changeRole(); // ✅ becomes owner then direct to add-car
    }
  };

  // ===== Motion variants =====
  const section = {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 18 },
    },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const car = {
    hidden: { opacity: 0, x: 30, y: 10, scale: 0.98 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 160, damping: 18, delay: 0.05 },
    },
  };

  return (
    <motion.div
      variants={section}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="relative flex flex-col md:flex-row md:items-start items-center justify-between
      px-8 md:pl-14 pt-10 bg-[#0d0d0e] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden"
    >
      {/* Soft glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px]
        rounded-full bg-white/15 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-32 -right-24 w-[520px] h-[520px]
        rounded-full bg-black/15 blur-3xl"
      />

      {/* Text Section */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="text-white flex-1 pr-4 pb-10 md:pb-0 relative z-10"
      >
        <motion.h2 variants={item} className="text-3xl font-semibold">
          Do You Own a Luxury Car?
        </motion.h2>

        <motion.p variants={item} className="mt-2 text-lg font-medium opacity-90">
          Monetize your vehicle effortlessly by listing it on CarRental.
        </motion.p>

        <motion.p variants={item} className="max-w-lg mt-2 text-sm opacity-80">
          We take care of insurance, driver verification and secure payments —
          so you can earn passive income, stress-free.
        </motion.p>

        <motion.button
          variants={item}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          onClick={handleListCarClick}
          className="relative overflow-hidden px-8 py-3 bg-white hover:bg-slate-50 transition-all
          text-primary font-semibold rounded-lg text-sm mt-6 cursor-pointer shadow-md"
        >
          {/* Shine sweep */}
          <motion.span
            aria-hidden="true"
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/10 skew-x-[-20deg]"
            style={{ width: "45%" }}
          />
          <span className="relative z-10">List your car</span>
        </motion.button>
      </motion.div>

      {/* Image Section */}
      <motion.div
        variants={car}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10"
      >
        <motion.img
          src={assets.banner_car_image}
          alt="car"
          className="mt-4 md:mt-0 max-h-48 md:max-h-60 object-contain select-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;
