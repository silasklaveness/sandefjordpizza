"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Homemeny from "../components/layout/HomeMeny";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.1], ["100vh", "0vh"]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="fixed inset-0 z-0">
        <Image
          src="/homepagebg.png"
          alt="Restaurant background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 text-white"
        style={{ opacity: heroOpacity }}
      >
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Velkommen til Tønsberg Pizza
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl mb-8 text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Omtalt som «byens beste pizza» siden 1990-tallet!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className=""
              >
                <Link
                  href="/menu"
                  className="bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-orange-600 transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Se vår meny / Bestill
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <ChevronDown size={32} className="text-white opacity-75" />
        </motion.div>
      </motion.div>

      <motion.div className="relative z-20 bg-white">
        <div className="px-4 md:px-8">
          <Homemeny />
        </div>

        <div className="py-10 px-4 md:px-8 ">
          <div className="text-center">
            <SectionHeaders subHeader={"Vår historie"} mainHeader={"Om oss"} />
          </div>
          <div className="text-gray-700 max-w-3xl mx-auto mt-12 flex flex-col gap-8">
            <p className="text-lg leading-relaxed">
              Vi ønsker alle nye og eksisterende kunder velkommen til en herlig
              smaksopplevelse. Tønsberg Pizza har helt siden 90-tallet blitt
              omtalt som «byens beste pizza». Vi benytter ferske lokale råvarer
              og baker våre ferske pizzabunner hver dag.
            </p>
            <p className="text-lg leading-relaxed">
              Vi ønsker deg velkommen inn i vår restaurant i sentrum av Tønsberg
              for en smaksopplevelse du sent vil glemme!
            </p>
          </div>
        </div>

        <div className="text-center py-24 px-4 md:px-8 bg-gradient-to-b from-white to-orange-50">
          <div className="text-center">
            <SectionHeaders
              subHeader={"Ikke nøl"}
              mainHeader={"Bare å kontakte oss "}
            />
          </div>
          <motion.a
            className="text-4xl md:text-6xl font-bold mt-12 text-orange-500 hover:text-orange-600 transition-colors duration-300 inline-block"
            href="tel:+4745786703"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +47 45786703
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
