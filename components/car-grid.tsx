"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cars } from "@/data/cars";
import { CarCard } from "@/components/car-card";
import { fadeUp, staggerContainer } from "@/lib/motion";

const BODY_TYPE_PILLS = ["All", "Sedan", "SUV", "Coupe"] as const;

export function CarGrid() {
  const [bodyType, setBodyType] =
    useState<(typeof BODY_TYPE_PILLS)[number]>("All");

  const visibleCars =
    bodyType === "All" ? cars : cars.filter((car) => car.bodyType === bodyType);

  return (
    <section id="inventory" className="bg-background px-3 pb-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 hidden md:block"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Featured Inventory
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] text-muted">
            Nine hand-selected vehicles, each inspected and certified before
            it reaches you.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {BODY_TYPE_PILLS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBodyType(type)}
              className={`rounded-full border px-4 py-2 text-[0.85rem] font-medium transition-colors duration-200 ${
                bodyType === type
                  ? "border-foreground bg-foreground text-accent-foreground"
                  : "border-border-strong text-muted hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2"
        >
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </motion.div>

        <a
          href="#inventory"
          className="mt-8 block text-center text-[0.9rem] font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
        >
          View all inventory
        </a>
      </div>
    </section>
  );
}
