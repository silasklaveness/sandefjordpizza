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
import {
  ChevronDown,
  Phone,
  MapPin,
  Clock,
  Mail,
  Pizza,
  Utensils,
  Beer,
} from "lucide-react";
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
                <Link href="/menu" passHref>
                  <motion.a
                    className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-500 transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Se vår meny / Bestill
                  </motion.a>
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <OpeningHours />
            </motion.div>
            <motion.div
              className="bg-gray-900 p-6 rounded-lg shadow-md text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
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

        <div
          id="about"
          className="py-24 px-4 md:px-8 bg-gradient-to-b from-black to-gray-900"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <SectionHeaders
                subHeader={"Vår historie"}
                mainHeader={"Om oss"}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6 text-gray-300"
              >
                <h3 className="text-3xl font-bold text-yellow-400">
                  Sandefjord Pizza
                </h3>
                <p className="text-xl italic">Bakt med kjærlighet</p>
                <p className="text-lg leading-relaxed">
                  Vi serverer pizza, kebab, hamburger og salat. Sett deg ned i
                  vår koselige, hjemmekoselige pizza-hytte og nyt en av våre
                  fantastiske pizzaer. Hvis du har lyst på noe annet en pizza så
                  har vi også kebab, hamburger, kylling og pølse-retter. Vi har
                  skjenkebevilgning og servering med alle rettigheter.
                </p>
                <div className="flex justify-center md:justify-start space-x-8 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <Pizza className="w-12 h-12 text-yellow-400" />
                    <span className="mt-2 text-sm">Pizza</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <Utensils className="w-12 h-12 text-yellow-400" />
                    <span className="mt-2 text-sm">Diverse retter</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <Beer className="w-12 h-12 text-yellow-400" />
                    <span className="mt-2 text-sm">Skjenkebevilgning</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative h-96 rounded-lg overflow-hidden shadow-2xl"
              >
                <Image
                  src="/restaurantinside.png"
                  alt="Sandefjord Pizza Restaurant"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <p className="text-white text-3xl font-bold text-center px-4">
                    Velkommen til vår pizza-hytte!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <section
          id="contact"
          className="py-24 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-black"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <SectionHeaders
                subHeader={"Ikke nøl"}
                mainHeader={"Bare kontakt oss"}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-yellow-400 rounded-full p-4 mb-4">
                  <Phone className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ring oss
                </h3>
                <Button
                  asChild
                  variant="link"
                  className="text-2xl font-bold text-yellow-400 hover:text-yellow-500 transition-colors duration-300"
                >
                  <motion.a
                    href="tel:+4745786703"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +47 45786703
                  </motion.a>
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="bg-yellow-400 rounded-full p-4 mb-4">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  E-post oss
                </h3>
                <Button
                  asChild
                  variant="link"
                  className="text-2xl font-bold text-yellow-400 hover:text-yellow-500 transition-colors duration-300"
                >
                  <motion.a
                    href="mailto:info@sandefjordpizza.no"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    info@sandefjordpizza.no
                  </motion.a>
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-yellow-400 rounded-full p-4 mb-4">
                  <MapPin className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Besøk oss
                </h3>
                <p className="text-gray-300 text-center">
                  Peter Castbergs gate 9
                  <br />
                  3210 Sandefjord
                </p>
              </motion.div>
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Button
                asChild
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl"
              >
                <motion.a
                  href="https://www.google.no/maps/place/Sandefjord+Pizza,+Grill+og+Kaffebar/@59.1298162,10.2024753,14z/data=!4m6!3m5!1s0x4646c096e573f5bd:0x41aac72d93c040d2!8m2!3d59.1352553!4d10.2219246!16s%2Fg%2F1hc243hcp?hl=no&entry=ttu&g_ep=EgoyMDI0MDkyNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Vis på kart
                </motion.a>
              </Button>
            </motion.div>
          </div>
        </section>
        <Footer />
      </motion.div>
    </div>
  );
}
