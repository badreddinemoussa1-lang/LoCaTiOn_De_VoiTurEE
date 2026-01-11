import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

const MyBookings = () => {
  const { axios, currency, user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/user");

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    user && fetchMyBookings();
    // eslint-disable-next-line
  }, [user]);

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
      transition: { type: "spring", stiffness: 150, damping: 18 },
    },
  };

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const card = {
    hidden: { opacity: 0, y: 18, scale: 0.99, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
  };

  const price = {
    hidden: { opacity: 0, x: 10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 220, damping: 18, delay: 0.05 },
    },
  };

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl relative overflow-hidden"
    >
      {/* soft glows */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 right-[-140px] w-[560px] h-[560px] rounded-full bg-primary-300/20 blur-3xl" />

      <motion.div variants={fadeUp} className="relative z-10">
        <Title
          title="My Bookings"
          subTitle="View and manage your all car bookings"
          align="left"
        />
      </motion.div>

      <motion.div
        variants={list}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        {/* Loading / Empty state */}
        <AnimatePresence mode="popLayout">
          {loading && (
            <motion.p
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 mt-8"
            >
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                Loading your bookings...
              </motion.span>
            </motion.p>
          )}

          {!loading && bookings.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 mt-8"
            >
              No bookings found yet.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Booking cards */}
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            variants={card}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12 bg-white/80 backdrop-blur"
          >
            {/* LEFT */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3 bg-light">
                <motion.img
                  src={booking.car.image}
                  alt=""
                  className="w-full h-auto aspect-video object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              <p className="text-lg font-medium mt-2">
                {booking.car.brand} {booking.car.model}
              </p>

              <p className="text-gray-500">
                {booking.car.year} • {booking.car.category} • {booking.car.location}
              </p>
            </div>

            {/* MIDDLE */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-3 py-1.5 bg-light rounded"
                >
                  Booking #{index + 1}
                </motion.p>

                <motion.p
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </motion.p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  alt=""
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split("T")[0]} To{" "}
                    {booking.returnDate.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  alt=""
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>

            {/* RIGHT (PRICE) */}
            <motion.div
              variants={price}
              className="md:col-span-1 flex flex-col justify-between gap-6"
            >
              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="text-2xl font-semibold text-primary"
                >
                  {currency} {booking.price}
                </motion.h1>
                <p>Booked on {booking.createdAt.split("T")[0]}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MyBookings;
