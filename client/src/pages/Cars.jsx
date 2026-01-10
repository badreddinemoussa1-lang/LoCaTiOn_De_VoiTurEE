import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Cars = () => {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [filteredCars, setFilteredCars] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      console.log("API RESPONSE:", data);

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
      // if no search params, show all available cars from context
      setFilteredCars(cars);
    }
    // eslint-disable-next-line
  }, [pickupLocation, pickupDate, returnDate, cars]);

  // ✅ Search by input (brand, model, category, location...)
  const searchedCars = filteredCars.filter((car) => {
    const searchText = input.toLowerCase();
    return (
      car.brand?.toLowerCase().includes(searchText) ||
      car.model?.toLowerCase().includes(searchText) ||
      car.category?.toLowerCase().includes(searchText) ||
      car.location?.toLowerCase().includes(searchText) ||
      car.transmission?.toLowerCase().includes(searchText) ||
      car.fuel_type?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      {/* Section Background */}
      <div className="bg-light py-24 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Available Cars
          </h1>

          <p className="mt-4 text-gray-500 max-w-xl">
            Browse our selection of premium vehicles available for your next adventure
          </p>

          {/* Search bar */}
          <div className="mt-10 flex items-center bg-white px-5 max-w-xl w-full h-14 rounded-full shadow-sm border border-gray-200">
            <img src={assets.search_icon} alt="" className="w-5 h-5 mr-3 opacity-60" />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Search by make, model, or features"
              className="w-full h-full outline-none text-gray-600 placeholder-gray-400"
            />

            <img src={assets.filter_icon} alt="" className="w-5 h-5 ml-3 opacity-60" />
          </div>
        </div>
      </div>

      {/* Cars grid */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          {isLoading ? "Loading cars..." : `Showing ${searchedCars.length} Cars`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {searchedCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
