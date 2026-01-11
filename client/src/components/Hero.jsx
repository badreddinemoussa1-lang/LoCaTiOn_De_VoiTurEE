import React, { useMemo, useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      "/cars?pickupLocation=" +
        pickupLocation +
        "&pickupDate=" +
        pickupDate +
        "&returnDate=" +
        returnDate
    );
  };

  // ===== Motion variants =====
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.35, when: "beforeChildren", staggerChildren: 0.12 },
    },
  };

  const headline = {
    hidden: { y: 26, opacity: 0, filter: "blur(8px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 170, damping: 18, mass: 0.8 },
    },
  };

  const subPop = {
    hidden: { y: 26, opacity: 0, scale: 0.98 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
  };

  const formVariant = {
    hidden: { y: 30, opacity: 0, scale: 0.95, filter: "blur(8px)" },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 16, delay: 0.05 },
    },
  };

  const fieldVariant = {
    hidden: { y: 10, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 18 },
    },
  };

  const floatCar = {
    hidden: { y: 40, opacity: 0, scale: 0.98 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 140, damping: 16, delay: 0.15 },
    },
  };

  const glow = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  // Split headline for staggered word animation
  const words = useMemo(() => ["Luxury", "cars", "on", "Rent"], []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative h-screen flex flex-col items-center justify-center gap-14 bg-light text-center overflow-hidden"
    >
      {/* Soft background glow */}
      <motion.div
        variants={glow}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2
        w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        variants={glow}
        className="pointer-events-none absolute -bottom-40 right-[-120px]
        w-[520px] h-[520px] rounded-full bg-primary-300/20 blur-3xl"
      />

      {/* Headline with staggered words */}
      <motion.h1
        variants={headline}
        className="text-4xl md:text-5xl font-semibold leading-tight"
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
              delay: 0.12 + i * 0.08,
            }}
            className="inline-block mr-3"
          >
            {w}
          </motion.span>
        ))}
      </motion.h1>

      {/* Form */}
      <motion.form
        variants={formVariant}
        onSubmit={handleSearch}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative flex flex-col md:flex-row items-start md:items-center 
        justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 
        bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        {/* subtle highlight ring */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 rounded-lg md:rounded-full
          ring-1 ring-black/5"
        />

        <motion.div
          variants={subPop}
          className="flex flex-col md:flex-row items-start md:items-center 
          gap-10 min-md:ml-8"
        >
          <motion.div variants={fieldVariant} className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <motion.p
              key={pickupLocation || "empty"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="px-1 text-sm text-gray-500"
            >
              {pickupLocation ? pickupLocation : "Please select location"}
            </motion.p>
          </motion.div>

          <motion.div variants={fieldVariant} className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date">Pick-up Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500"
              required
            />
          </motion.div>

          <motion.div variants={fieldVariant} className="flex flex-col items-start gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              className="text-sm text-gray-500"
              required
            />
          </motion.div>
        </motion.div>

        {/* Button with shine + icon micro animation */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="relative overflow-hidden flex items-center justify-center gap-2
          px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white
          rounded-full cursor-pointer"
        >
          {/* shine sweep */}
          <motion.span
            aria-hidden="true"
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 bg-white/20 skew-x-[-20deg]"
            style={{ width: "45%" }}
          />

          <motion.img
            src={assets.search_icon}
            alt="search"
            className="brightness-300 relative z-10"
            whileHover={{ rotate: 10, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          />
          <span className="relative z-10">Search</span>
        </motion.button>
      </motion.form>

      {/* Car image: entrance + gentle float */}
      <motion.img
        variants={floatCar}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        src={assets.main_car}
        alt="car"
        className="max-h-80 drop-shadow-[0px_18px_28px_rgba(0,0,0,0.15)]"
      />
    </motion.div>
  );
};

export default Hero;
