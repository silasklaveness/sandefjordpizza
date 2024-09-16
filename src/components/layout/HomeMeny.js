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
import { motion } from "framer-motion";

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
    <section className="">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <SectionHeaders
            subHeader={"Sjekk ut"}
            mainHeader={"Våre bestselgere!"}
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
          className="mb-12"
        >
          {bestSellers?.length > 0 &&
            bestSellers.map((item) => (
              <SwiperSlide key={item._id}>
                <MenyItem {...item} />
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl"
            >
              <Link href="/menu" className="inline-flex items-center">
                Se hele menyen
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
