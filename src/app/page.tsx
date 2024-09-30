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
import { ChevronDown, Phone, MapPin, Clock } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OpeningHours from "@/components/ui/openinghours";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const contentY = useTransform(scrollYProgress, [0, 0.2], ["0vh", "-20vh"]);

  useEffect(() => {
    setIsLoaded(true);
    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkIfOpen = async () => {
    try {
      const response = await fetch("/api/restaurant");
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant data");
      }
      const data = await response.json();
      const now = new Date();
      const todayString = now.toISOString().split("T")[0];
      const todayTimes = data.openingTimes[todayString] || {
        open: "12:00",
        close: "22:00",
      };

      const [openHour, openMinute] = todayTimes.open.split(":").map(Number);
      const [closeHour, closeMinute] = todayTimes.close.split(":").map(Number);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      setIsOpen(
        (currentHour > openHour ||
          (currentHour === openHour && currentMinute >= openMinute)) &&
          (currentHour < closeHour ||
            (currentHour === closeHour && currentMinute < closeMinute))
      );
    } catch (error) {
      console.error("Error checking if open:", error);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative bg-black">
      <div className="fixed inset-0 z-0">
        <Image
          src="/homepagebg.png"
          alt="Restaurantbakgrunn"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
        />
      </div>

      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 text-white"
        style={{ opacity: heroOpacity, scale: heroScale, y: contentY }}
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
                <span className="text-yellow-400">SANDEFJORD</span> PIZZA
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl mb-8 text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Mange mener vi har Sandefjords beste pizza
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link
                  href="/menu"
                  className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Se vår meny / Bestill
                </Link>
                <Button
                  className={`px-4 py-2 rounded-full text-white font-semibold ${
                    isOpen
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                >
                  <Clock className="mr-2" />
                  {isOpen ? "Åpent nå" : "Stengt nå"}
                </Button>
              </motion.div>
              {!isOpen && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mt-4 text-sm text-gray-300"
                >
                  Du kan fortsatt bestille for senere levering eller henting!
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={32} className="text-yellow-400 opacity-75" />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-20 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="px-4 md:px-8 py-16">
          <Homemeny />
        </div>
        <div className="py-16 px-4 md:px-8 border-t border-gray-800">
          <div className="text-center mb-12">
            <SectionHeaders
              subHeader={"Finn oss"}
              mainHeader={"Åpningstider og Adresse"}
            />
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <OpeningHours />
            </motion.div>
            <motion.div
              className="bg-gray-900 p-6 rounded-lg shadow-md text-white"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center text-yellow-400">
                <MapPin className="mr-2" /> Adresse
              </h3>
              <p className="mb-4">Nedre Langgate 18, 3126 Tønsberg</p>
              <a
                href="https://www.google.com/maps/place/Tonsberg+Pizza/@59.2734456,10.4570829,466m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4646b0dafeab45e3:0x8d2f594d70dc646!8m2!3d59.2734429!4d10.4596578!16s%2Fg%2F1td7xpbq?entry=ttu&g_ep=EgoyMDI0MDkxMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors duration-300"
              >
                Vis på kart
              </a>
            </motion.div>
          </div>
        </div>

        <div id="about" className="py-16 px-4 md:px-8 border-t border-gray-800">
          <div className="text-center">
            <SectionHeaders subHeader={"Vår historie"} mainHeader={"Om oss"} />
          </div>
          <motion.div
            className="text-gray-300 max-w-3xl mx-auto mt-12 flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg leading-relaxed">
              Vi ønsker alle nye og eksisterende kunder velkommen til en herlig
              smaksopplevelse. Sandefjord Pizza har helt siden 90-tallet blitt
              omtalt som «byens beste pizza». Vi benytter ferske lokale råvarer
              og baker våre ferske pizzabunner hver dag.
            </p>
            <p className="text-lg leading-relaxed">
              Vi ønsker deg velkommen inn i vår restaurant i sentrum av
              Sandefjord for en smaksopplevelse du sent vil glemme!
            </p>
          </motion.div>
        </div>

        <section
          id="contact"
          className="text-center py-24 px-4 md:px-8 border-t border-gray-800"
        >
          <div className="text-center">
            <SectionHeaders
              subHeader={"Ikke nøl"}
              mainHeader={"Bare kontakt oss"}
            />
          </div>
          <motion.a
            className="text-4xl md:text-6xl font-bold mt-12 text-yellow-400 hover:text-yellow-500 transition-colors duration-300 inline-flex items-center gap-4"
            href="tel:+4745786703"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-12 h-12" />
            +47 45786703
          </motion.a>
        </section>
        <Footer />
      </motion.div>
    </div>
  );
}
