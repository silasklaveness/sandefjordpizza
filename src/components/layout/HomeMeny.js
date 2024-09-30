"use client";

import { useEffect, useState } from "react";
import MenyItem from "../meny/MenyItem";
import SectionHeaders from "./SectionHeaders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Homemeny() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch("/api/menu-items")
      .then((res) => res.json())
      .then((menuItems) => {
        setBestSellers(menuItems.slice(-4));
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionHeaders
            subHeader={"Sjekk ut"}
            mainHeader={"Våre bestselgere!"}
          />
        </div>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="mb-12"
        >
          {bestSellers.map((item) => (
            <SwiperSlide key={item._id}>
              <MenyItem {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl"
          >
            <Link href="/menu" className="inline-flex items-center">
              Se hele menyen
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
