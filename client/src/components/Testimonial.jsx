import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const Testimonial = () => {
  const testimonials = [
  {
  name: "Sara El Amrani",
  location: "Casablanca, Morocco",
  image: assets.testimonial_image_1,
  testimonial: "T7jzt tomobil online w kolchi kan sahl بزاف. L’car ja f waqtou, ndifa, و lowner كان محترم. Khdit biha weekend كامل بلا حتى mochkil. Ghadi nعاود أكيد!"
},
{
  name: "Youssef Benali",
  location: "Rabat, Morocco",
  image: assets.testimonial_image_3,
  testimonial: "Service زوين و سريع! Knt محتاج سيارة فآخر لحظة و لقيت اختيار مزيان بثمن مناسب. Livraison كانت سريعة والسيارة كانت فحالة ممتازة. كننصح بيه!"
},
{
  name: "Khadija Ait Lahcen",
  location: "Marrakech, Morocco",
  image: assets.testimonial_image_2,
  testimonial: "Tajriba رائعة! استأجرت سيارة باش نمشي لأوريكا و الطريق كان طويل. السيارة كانت مريحة بزاف و fuel economy زوينة. Support تجاوب معايا بسرعة. شكراً بزاف!"
}


  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial,index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className=" text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                    <img key={index} src={assets.star_icon} alt="star_icon" />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light ">
              "{testimonial.testimonial}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
