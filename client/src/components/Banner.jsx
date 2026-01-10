import React from "react";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
<div className="flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 pt-10 bg-[#0558FE] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden">
      
      {/* Text Section */}
      <div className="text-white flex-1 pr-4 pb-10 md:pb-0">
        <h2 className="text-3xl font-semibold">Do You Own a Luxury Car?</h2>
        <p className="mt-2 text-lg font-medium opacity-90">
          Monetize your vehicle effortlessly by listing it on CarRental.
        </p>
        <p className="max-w-lg mt-2 text-sm opacity-80">
          We take care of insurance, driver verification and secure payments —
          so you can earn passive income, stress-free.
        </p>

        <button className="px-8 py-3 bg-white hover:bg-slate-50 transition-all text-primary font-semibold rounded-lg text-sm mt-6 cursor-pointer shadow-md">
          List your car
        </button>
      </div>

      {/* Image Section */}
      {/* Fixed max-h-45 to valid Tailwind class max-h-48 or md:max-h-60 for desktop */}
      <img
        src={assets.banner_car_image}
        alt="car"
        className="mt-4 md:mt-0 max-h-48 md:max-h-60 object-contain"
      />
    </div>
  );
};

export default Banner;