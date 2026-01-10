import React from "react";

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-12 mb-40">
      <h1 className="md:text-4xl text-2xl font-semibold">
        Get Car Rental Deals First!
      </h1>

      <p className="md:text-lg text-gray-500/70 pb-8 max-w-2xl">
        Subscribe to receive exclusive discounts, promo codes, and updates on new cars
        available in your city.
      </p>

      <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-600"
          type="email"
          placeholder="Enter your email address"
          required
        />

        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Get Offers
        </button>
      </form>

      <p className="text-xs text-gray-400 pt-2">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default Newsletter;
