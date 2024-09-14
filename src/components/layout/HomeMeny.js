"use client";

import { useEffect, useState } from "react";
import MenyItem from "../meny/MenyItem";
import SectionHeaders from "./SectionHeaders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Homemeny() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch("/api/menu-items").then((res) =>
      res.json().then((menuItems) => {
        setBestSellers(menuItems.slice(-4));
      })
    );
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <SectionHeaders
            subHeader={"Sjekk ut"}
            mainHeader={"Våre beste selgere!"}
          />
        </div>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
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
          className="mb-8"
        >
          {bestSellers?.length > 0 &&
            bestSellers.map((item) => (
              <SwiperSlide key={item._id}>
                <MenyItem {...item} />
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="text-center">
          <Button
            asChild
            className="bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300"
          >
            <Link href="/menu" className="inline-flex items-center">
              Se hele menyen
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
