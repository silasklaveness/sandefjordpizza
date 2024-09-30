"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { ChevronDown, Calendar, Clock } from "lucide-react";

// Mock data for news items (replace with actual API call)
const mockNews = [
  {
    id: 1,
    title: "Ny sesongmeny lansert!",
    content:
      "Vi er glade for å presentere vår nye sommermeny med ferske, lokale ingredienser.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-06-15",
    time: "12:00",
  },
  {
    id: 2,
    title: "Utvidet åpningstid i helgene",
    content:
      "Fra neste uke holder vi åpent til kl. 01:00 på fredager og lørdager.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-06-10",
    time: "15:30",
  },
  {
    id: 3,
    title: "Ny pizzaovn installert",
    content:
      "Vi har oppgradert vårt kjøkken med en toppmoderne pizzaovn for enda bedre smak!",
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-06-05",
    time: "09:45",
  },
];

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);

  useEffect(() => {
    // Replace this with an actual API call when available
    setNews(mockNews);
  }, []);

  const toggleExpand = (id) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  return (
    <section className="bg-black text-white pt-24 min-h-screen">
      <div className="container mx-auto px-4">
        <SectionHeaders
          subHeader="Oppdateringer"
          mainHeader="Siste nytt fra Sandefjord Pizza"
        />

        <div className="mt-12 space-y-8">
          <AnimatePresence>
            {news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover md:h-full md:w-48"
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-yellow-400 font-semibold mb-1">
                      <span className="flex items-center">
                        <Calendar className="mr-2" size={16} />
                        {new Date(item.date).toLocaleDateString("no-NO")}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl leading-tight font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-400">
                      {expandedNews === item.id
                        ? item.content
                        : `${item.content.substring(0, 100)}...`}
                    </p>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                    >
                      {expandedNews === item.id ? "Les mindre" : "Les mer"}
                      <ChevronDown
                        className={`ml-2 transform transition-transform duration-200 ${
                          expandedNews === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
