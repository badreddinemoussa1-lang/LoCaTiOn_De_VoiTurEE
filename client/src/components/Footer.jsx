import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500">
      <div className="flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b">
        <div>
          <img src={assets.logo} alt="logo" className="mb-4 h-8 md:h-9" />
          <p className="max-w-80 mt-3">
            Premium car rental service with a wide selection of luxury and
            everyday vehicules for all drivers .
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a href="#">
              <img
                src={assets.facebook_logo}
                className="w-5 h-5"
                alt="facebook_logo"
              />
            </a>
            <a href="#">
              <img
                src={assets.instagram_logo}
                className="w-5 h-5"
                alt="instagram_logo"
              />
            </a>
            <a href="#">
              <img
                src={assets.twitter_logo}
                className="w-5 h-5"
                alt="twitter_logo"
              />
            </a>
            <a href="#">
              <img
                src={assets.gmail_logo}
                className="w-5 h-5"
                alt="gmail_logo"
              />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Quick links
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Browse car</a>
            </li>
            <li>
              <a href="#">List your car </a>
            </li>
            <li>
              <a href="#">About us </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Resources
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Insurance</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Contact
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li>12 Avenue Mohammed V</li>
            <li>Casablanca, Morocco 20000</li>
            <li>+212 6 12 34 56 78</li>
            <li>support@carrental.ma</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>
          © {new Date().getFullYear()} CarRental Morocco. All rights reserved.
        </p>
        <ul className="flex items-center gap-3 text-sm text-gray-500">
          <li>
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
          </li>
          <span>|</span>
          <li>
            <a href="#" className="hover:text-primary">
              Terms & Conditions
            </a>
          </li>
          <span>|</span>
          <li>
            <a href="#" className="hover:text-primary">
              Cookies
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
