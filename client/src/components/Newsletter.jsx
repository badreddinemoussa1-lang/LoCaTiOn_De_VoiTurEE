import React, { useState } from "react";
import { motion } from "motion/react";

const Newsletter = () => {
  const [focused, setFocused] = useState(false);

  const container = {
    hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 140, damping: 18 },
    },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  return (
    <section className="w-full bg-white py-24 md:py-32 overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto max-w-4xl px-4"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-semibold text-gray-900"
          >
            Never Miss a Deal!
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-3 max-w-2xl text-sm md:text-base text-gray-500"
          >
            Subscribe to get the latest offers, new arrivals, and exclusive discounts
          </motion.p>

          {/* Form */}
          <motion.form
            variants={item}
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex w-full max-w-2xl items-stretch relative"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            {/* soft focus glow */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: focused ? 1 : 0,
                scale: focused ? 1 : 0.98,
              }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute -inset-1 rounded-lg bg-gray-200 blur-md"
            />

            <motion.input
              type="email"
              required
              placeholder="Enter your email id"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="relative z-10 w-full rounded-l-md border border-gray-300 px-4 py-3 text-gray-700
                         outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />

            <motion.button
              type="submit"
              className="relative z-10 min-w-[160px] rounded-r-md bg-gray-600 px-6 py-3 font-medium text-white
                         hover:bg-gray-700 transition-colors overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {/* subtle shine sweep */}
              <motion.span
                aria-hidden="true"
                initial={{ x: "-120%" }}
                whileHover={{ x: "120%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/15 skew-x-[-20deg]"
                style={{ width: "45%" }}
              />
              <span className="relative z-10">Subscribe</span>
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
