import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();

  // ===== Motion variants =====
  const section = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.12 },
    },
  };

  const titleWrap = {
    hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 18 },
    },
  };

  const grid = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  const card = {
    hidden: { y: 16, opacity: 0, scale: 0.98 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const cta = {
    hidden: { y: 12, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 220, damping: 18, delay: 0.08 },
    },
  };

  return (
    <motion.section
      variants={section}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative flex flex-col items-center py-24
      px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-50/40 overflow-hidden"
    >
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2
      w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-[-120px]
      w-[520px] h-[520px] rounded-full bg-primary-300/20 blur-3xl" />

      {/* Title */}
      <motion.div variants={titleWrap} className="text-center">
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
        />
      </motion.div>

      {/* ✅ Limit overall width so images don't stretch too wide */}
      <div className="w-full max-w-6xl">
        {/* Cards Grid */}
        <motion.div
          variants={grid}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {cars?.slice(0, 6).map((carItem) => (
            <motion.div
              key={carItem._id}
              variants={card}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-full"
            >
              {/* ✅ Card wrapper to keep consistent sizing */}
              <div className="w-full">
                <CarCard car={carItem} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.button
        variants={cta}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        onClick={() => {
          navigate("/cars");
          window.scrollTo(0, 0);
        }}
        className="relative overflow-hidden flex items-center justify-center gap-2
        px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md
        mt-16 cursor-pointer bg-white"
      >
        {/* Shine sweep */}
        <motion.span
          aria-hidden="true"
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 bg-black/5 skew-x-[-20deg]"
          style={{ width: "45%" }}
        />

        <span className="relative z-10">Explore all cars</span>

        <motion.img
          src={assets.arrow_icon}
          alt="arrow"
          className="w-4 h-4 relative z-10"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
        />
      </motion.button>
    </motion.section>
  );
};

export default FeaturedSection;
