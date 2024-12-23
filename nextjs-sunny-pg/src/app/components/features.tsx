"use client";
import { featuresData } from "./featuresData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface FeatureCardProps {
  title: string;
  subtext: string;
  image: React.ReactNode;
}

const FeatureCard = ({ title, subtext, image }: FeatureCardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center w-64 h-80 my-5">
      <div className="w-full h-40 mb-4 flex justify-center items-center">
        <div className="w-42 h-32 overflow-hidden flex items-center justify-center">
          {image}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{subtext}</p>
    </div>
  );
};

export default function Features() {
  return (
    <div className="my-6 mx-auto">
      <Swiper
        modules={[Navigation]}
        spaceBetween={1}
        slidesPerView={1.25}
        navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full"
      >
        {featuresData.map((feature: any, index: number) => (
          <SwiperSlide key={index} className="ml-2">
            <FeatureCard
              title={feature.title}
              subtext={feature.subtext}
              image={feature.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
