import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Sara El Amrani",
      location: "Casablanca, Morocco",
      image: assets.testimonial_image_1,
      testimonial:
        "T7jzt tomobil online w kolchi kan sahl بزاف. L’car ja f waqtou, ndifa, و lowner كان محترم. Khdit biha weekend كامل بلا حتى mochkil. Ghadi nعاود أكيد!",
    },
    {
      name: "Youssef Benali",
      location: "Rabat, Morocco",
      image: assets.testimonial_image_3,
      testimonial:
        "Service زوين و سريع! Knt محتاج سيارة فآخر لحظة و لقيت اختيار مزيان بثمن مناسب. Livraison كانت سريعة والسيارة كانت فحالة ممتازة. كننصح بيه!",
    },
    {
      name: "Khadija Ait Lahcen",
      location: "Marrakech, Morocco",
      image: assets.testimonial_image_2,
      testimonial:
        "Tajriba رائعة! استأجرت سيارة باش نمشي لأوريكا و الطريق كان طويل. السيارة كانت مريحة بزاف و fuel economy زوينة. Support تجاوب معايا بسرعة. شكراً بزاف!",
    },
  ];

  // ===== Motion variants =====
  const section = {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 140, damping: 18 },
    },
  };

  const titleWrap = {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 160, damping: 18 },
    },
  };

  const grid = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 22, scale: 0.98, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
  };

  const quote = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut", delay: 0.05 },
    },
  };

  const starsContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
  };

  const star = {
    hidden: { opacity: 0, y: 6, scale: 0.85, rotate: -10 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 18 },
    },
  };

  return (
    <motion.section
      variants={section}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative py-28 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden"
    >
      {/* soft background glows */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-[-140px] w-[560px] h-[560px] rounded-full bg-primary-300/20 blur-3xl" />

      {/* Title */}
      <motion.div variants={titleWrap} className="text-center">
        <Title
          title="What Our Customers Say"
          subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."
        />
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
      >
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            variants={card}
            whileHover={{
              y: -10,
              rotate: idx === 1 ? 0 : idx === 0 ? -0.5 : 0.5,
              scale: 1.01,
            }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative bg-white p-6 rounded-xl shadow-lg border border-primary-50 overflow-hidden"
          >
            {/* subtle hover glow */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-sky-200/20"
            />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3">
              <motion.img
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-black/5"
                src={t.image}
                alt={t.name}
              />
              <div>
                <p className="text-xl text-gray-900">{t.name}</p>
                <p className="text-gray-500">{t.location}</p>
              </div>
            </div>

            {/* Stars */}
            <motion.div
              variants={starsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative z-10 flex items-center gap-1 mt-4"
            >
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <motion.img
                    key={i}
                    variants={star}
                    src={assets.star_icon}
                    alt="star_icon"
                    className="w-4 h-4"
                  />
                ))}
            </motion.div>

            {/* Quote */}
            <motion.p
              variants={quote}
              className="relative z-10 text-gray-500 max-w-90 mt-4 font-light leading-relaxed"
            >
              “{t.testimonial}”
            </motion.p>

            {/* tiny decorative quote icon */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/10 blur-xl"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Testimonial;
