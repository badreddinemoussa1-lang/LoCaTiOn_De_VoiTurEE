import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

const CarDetails = () => {
  const { id } = useParams();

  const {
    cars,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useAppContext();

  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [focused, setFocused] = useState(null); // "pickup" | "return" | null
  const currency = import.meta.env.VITE_CURRENCY;

  // ✅ get car from context
  useEffect(() => {
    if (cars?.length > 0) {
      const foundCar = cars.find((c) => c._id.toString() === id);
      setCar(foundCar);
    }
  }, [cars, id]);

  // ✅ Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error("Return date must be after pickup date");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/create", {
        carId: id,
        pickupDate,
        returnDate,
        location: car.location,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ===== Motion variants =====
  const page = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.25, when: "beforeChildren", staggerChildren: 0.08 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 18 },
    },
  };

  const imgWrap = {
    hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(12px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 140, damping: 16 },
    },
  };

  const specsGrid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const specCard = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const formVariant = {
    hidden: { opacity: 0, x: 18, y: 10, filter: "blur(10px)" },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 18, delay: 0.05 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {car ? (
        <motion.div
          key="details"
          variants={page}
          initial="hidden"
          animate="show"
          className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 relative overflow-hidden"
        >
          {/* soft glows */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-44 right-[-140px] w-[620px] h-[620px] rounded-full bg-primary-300/20 blur-3xl" />

          {/* Back */}
          <motion.button
            variants={fadeUp}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer relative z-10"
          >
            <motion.img
              src={assets.arrow_icon}
              alt=""
              className="rotate-180 opacity-65"
              whileHover={{ rotate: 180, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
            Back to all cars
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2">
              {/* Image */}
              <motion.div
                variants={imgWrap}
                className="w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-md bg-light"
              >
                <motion.img
                  src={car.image}
                  alt=""
                  className="w-full h-full object-cover object-center"
                  // subtle float
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.05 }}
                    className="text-3xl font-bold"
                  >
                    {car.brand} {car.model}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-gray-500 text-lg"
                  >
                    {car.category} • {car.year}
                  </motion.p>
                </div>

                <motion.hr
                  initial={{ opacity: 0, scaleX: 0.9 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.35 }}
                  className="border-borderColor my-6"
                />

                {/* Specs */}
                <motion.div
                  variants={specsGrid}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                  {[
                    { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                    { icon: assets.fuel_icon, text: car.fuel_type },
                    { icon: assets.car_icon, text: car.transmission },
                    { icon: assets.location_icon, text: car.location },
                  ].map(({ icon, text }) => (
                    <motion.div
                      key={text}
                      variants={specCard}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="flex flex-col items-center bg-light p-4 rounded-lg border border-black/5"
                    >
                      <motion.img
                        src={icon}
                        alt=""
                        className="h-5 mb-2"
                        whileHover={{ rotate: 8, scale: 1.06 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      />
                      <p>{text}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Description */}
                <motion.div variants={fadeUp}>
                  <h1 className="text-xl font-medium mb-3">Description</h1>
                  <p className="text-gray-500">{car.description}</p>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT SIDE FORM */}
            <motion.form
              variants={formVariant}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit}
              className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500 bg-white/90 backdrop-blur border border-black/5"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="flex items-center justify-between text-2xl text-gray-800 font-semibold"
              >
                {car.pricePerDay} {currency}
                <span className="text-base text-gray-400 font-normal">per day</span>
              </motion.p>

              <motion.hr
                initial={{ opacity: 0, scaleX: 0.9 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.35 }}
                className="border-borderColor my-6"
              />

              {/* Pickup */}
              <div className="flex flex-col gap-2 relative">
                <label htmlFor="pickup-date">Pickup Date</label>

                {/* glow */}
                <motion.div
                  aria-hidden="true"
                  animate={{
                    opacity: focused === "pickup" ? 1 : 0,
                    scale: focused === "pickup" ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.18 }}
                  className="pointer-events-none absolute -inset-1 rounded-xl bg-primary/15 blur-md"
                />

                <motion.input
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  type="date"
                  className="relative border border-borderColor px-3 py-2 rounded-lg bg-white"
                  required
                  id="pickup-date"
                  min={new Date().toISOString().split("T")[0]}
                  value={pickupDate}
                  onFocus={() => setFocused("pickup")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              {/* Return */}
              <div className="flex flex-col gap-2 relative">
                <label htmlFor="return-date">Return Date</label>

                {/* glow */}
                <motion.div
                  aria-hidden="true"
                  animate={{
                    opacity: focused === "return" ? 1 : 0,
                    scale: focused === "return" ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.18 }}
                  className="pointer-events-none absolute -inset-1 rounded-xl bg-primary/15 blur-md"
                />

                <motion.input
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  type="date"
                  className="relative border border-borderColor px-3 py-2 rounded-lg bg-white"
                  required
                  id="return-date"
                  min={pickupDate || new Date().toISOString().split("T")[0]}
                  value={returnDate}
                  onFocus={() => setFocused("return")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>

              {/* Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="relative overflow-hidden w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer"
              >
                {/* Shine sweep */}
                <motion.span
                  aria-hidden="true"
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white/20 skew-x-[-20deg]"
                  style={{ width: "45%" }}
                />
                <span className="relative z-10">Book Now</span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="text-center text-sm"
              >
                No credit card required to reserve
              </motion.p>
            </motion.form>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CarDetails;
