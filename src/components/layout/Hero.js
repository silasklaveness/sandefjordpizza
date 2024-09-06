"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LuxuriousHero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-32 overflow-hidden">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Everything is better with a{" "}
            <span className="text-primary">Pizza</span>
          </h1>
          <motion.p
            className="max-w-[600px] text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Pizza is the missing piece that makes every day complete, a simple
            yet delicious treat that brings joy to any occasion.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button className="bg-gradient-to-r from-primary to-primary-foreground text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
              Order now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Reserver bord
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Se meny!
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Image
            src="/restaurant.png"
            alt="Delicious pizza"
            fill
            style={{ objectFit: "contain" }}
            className="drop-shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 filter brightness-105 contrast-105"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
