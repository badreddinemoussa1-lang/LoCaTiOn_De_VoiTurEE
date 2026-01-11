import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Footer = () => {
  // ===== Motion variants =====
  const wrap = {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 18,
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  };

  const col = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 18 },
    },
  };

  const social = {
    hidden: { opacity: 0, y: 8, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 16 },
    },
  };

  return (
    <motion.footer
      variants={wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full px-6 md:px-16 lg:px-24 xl:px-32 text-sm text-gray-500 overflow-hidden"
    >
      {/* Soft glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-[-140px] w-[560px] h-[560px] rounded-full bg-primary-300/20 blur-3xl" />

      <div className="relative z-10 flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b">
        {/* Brand */}
        <motion.div variants={col}>
          <motion.img
            src={assets.logo}
            alt="logo"
            className="mb-4 h-8 md:h-9"
            whileHover={{ scale: 1.05, rotate: -1 }}
            transition={{ type: "spring", stiffness: 280, damping: 16 }}
          />

          <motion.p variants={item} className="max-w-80 mt-3">
            Premium car rental service with a wide selection of luxury and
            everyday vehicules for all drivers .
          </motion.p>

          <motion.div
            variants={item}
            className="flex items-center gap-3 mt-6"
          >
            {[
              { icon: assets.facebook_logo, alt: "facebook_logo" },
              { icon: assets.instagram_logo, alt: "instagram_logo" },
              { icon: assets.twitter_logo, alt: "twitter_logo" },
              { icon: assets.gmail_logo, alt: "gmail_logo" },
            ].map((s, i) => (
              <motion.a
                key={i}
                href="#"
                variants={social}
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className="p-2 rounded-full hover:bg-white/60 transition-colors"
              >
                <img src={s.icon} className="w-5 h-5" alt={s.alt} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Quick links */}
        <motion.div variants={col}>
          <motion.h2
            variants={item}
            className="text-base font-medium text-gray-800 uppercase"
          >
            Quick links
          </motion.h2>

          <motion.ul variants={item} className="mt-3 flex flex-col gap-1.5 text-sm">
            {["Home", "Browse car", "List your car", "About us"].map((t, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <a href="#" className="group relative inline-block hover:text-primary transition-colors">
                  {t}
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Resources */}
        <motion.div variants={col}>
          <motion.h2
            variants={item}
            className="text-base font-medium text-gray-800 uppercase"
          >
            Resources
          </motion.h2>

          <motion.ul variants={item} className="mt-3 flex flex-col gap-1.5">
            {["Help Center", "Terms of Service", "Privacy Policy", "Insurance"].map(
              (t, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <a href="#" className="hover:text-primary transition-colors">
                    {t}
                  </a>
                </motion.li>
              )
            )}
          </motion.ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={col}>
          <motion.h2
            variants={item}
            className="text-base font-medium text-gray-800 uppercase"
          >
            Contact
          </motion.h2>

          <motion.ul variants={item} className="mt-3 flex flex-col gap-1.5">
            {[
              "12 Avenue Mohammed V",
              "Casablanca, Morocco 20000",
              "+212 6 12 34 56 78",
              "support@carrental.ma",
            ].map((t, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        variants={col}
        className="relative z-10 flex flex-col md:flex-row gap-2 items-center justify-between py-5"
      >
        <motion.p variants={item}>
          © {new Date().getFullYear()} CarRental Morocco. All rights reserved.
        </motion.p>

        <motion.ul variants={item} className="flex items-center gap-3 text-sm text-gray-500">
          {["Privacy Policy", "Terms & Conditions", "Cookies"].map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              <motion.a
                href="#"
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="hover:text-primary transition-colors"
              >
                {t}
              </motion.a>
              {i !== 2 && <span className="text-gray-400">|</span>}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
