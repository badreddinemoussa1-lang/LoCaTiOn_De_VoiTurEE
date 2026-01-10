import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

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
        carId: id,              // ✅ FIX 1: correct key
        pickupDate,
        returnDate,
        location: car.location, // ✅ FIX 2: send location
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

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-md bg-light">
            <img
              src={car.image}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>

            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  <p>{text}</p>
                </div>
              ))}
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <form
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {car.pricePerDay} {currency}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="return-date"
              min={pickupDate || new Date().toISOString().split("T")[0]}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer"
          >
            Book Now
          </button>

          <p className="text-center text-sm">No credit card required to reserve</p>
        </form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
