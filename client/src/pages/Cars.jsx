import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

const Cars = () => {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [filteredCars, setFilteredCars] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const isSearchData = pickupLocation && pickupDate && returnDate;

  // ✅ Convert dd/mm/yyyy to yyyy-mm-dd
  const toISODate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // ✅ Search availability from backend
  const searchCarAvailability = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate: toISODate(pickupDate),
        returnDate: toISODate(returnDate),
      });

      if (data.success) {
        const availableCars = data.availableCars || data.cars || [];
        setFilteredCars(availableCars);

        if (availableCars.length === 0) {
          toast.error("No cars available");
        }
      } else {
        toast.error(data.message || "Error getting cars");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ When page loads
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      setFilteredCars(cars);
    }
    // eslint-disable-next-line
  }, [pickupLocation, pickupDate, returnDate, cars]);

  // ✅ Search by input (brand, model, category, location...)
  const searchedCars = useMemo(() => {
    const searchText = input.toLowerCase();
    return filteredCars.filter((car) => {
      return (
        car.brand?.toLowerCase().includes(searchText) ||
        car.model?.toLowerCase().includes(searchText) ||
        car.category?.toLowerCase().includes(searchText) ||
        car.location?.toLowerCase().includes(searchText) ||
        car.transmission?.toLowerCase().includes(searchText) ||
        car.fuel_type?.toLowerCase().includes(searchText)
      );
    });
  }, [filteredCars, input]);

  // ===== Motion variants =====
  const page = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } },
  };

  const hero = {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 150, damping: 18 },
    },
  };

  const heroStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const grid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  };

  const card = {
    hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 200, damping: 18 },
    },
  };

  return (
    <motion.div variants={page} initial="hidden" animate="show">
      {/* Hero */}
      <motion.div
        variants={hero}
        initial="hidden"
        animate="show"
        className="bg-light py-24 px-4 relative overflow-hidden"
      >
        {/* soft glows */}
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-44 right-[-140px] w-[560px] h-[560px] rounded-full bg-primary-300/20 blur-3xl" />

        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10"
        >
          <motion.h1
            variants={heroItem}
            className="text-4xl md:text-5xl font-semibold text-gray-900"
          >
            Available Cars
          </motion.h1>

          <motion.p variants={heroItem} className="mt-4 text-gray-500 max-w-xl">
            Browse our selection of premium vehicles available for your next
            adventure
          </motion.p>

          {/* Search bar */}
          <motion.div
            variants={heroItem}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="mt-10 max-w-xl w-full relative"
          >
            {/* focus glow */}
            <motion.div
              aria-hidden="true"
              animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute -inset-1 rounded-full bg-primary/15 blur-md"
            />

            <div className="relative z-10 flex items-center bg-white px-5 w-full h-14 rounded-full shadow-sm border border-gray-200">
              <motion.img
                src={assets.search_icon}
                alt=""
                className="w-5 h-5 mr-3 opacity-60"
                whileHover={{ rotate: 10, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              />

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                type="text"
                placeholder="Search by make, model, or features"
                className="w-full h-full outline-none text-gray-600 placeholder-gray-400"
              />

              <motion.img
                src={assets.filter_icon}
                alt=""
                className="w-5 h-5 ml-3 opacity-60"
                whileHover={{ rotate: -10, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Cars grid */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <div className="xl:px-20 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={isLoading ? "loading" : `count-${searchedCars.length}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500"
            >
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                >
                  Loading cars...
                </motion.span>
              ) : (
                `Showing ${searchedCars.length} Cars`
              )}
            </motion.p>
          </AnimatePresence>

          <motion.div
            variants={grid}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4"
          >
            {searchedCars.map((car) => (
              <motion.div
                key={car._id}
                variants={card}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="will-change-transform"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cars;
