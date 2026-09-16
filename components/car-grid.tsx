"use client";

import { motion } from "framer-motion";
import { cars } from "@/data/cars";
import { CarCard } from "@/components/car-card";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function CarGrid() {
  return (
    <section id="inventory" className="bg-background px-6 pb-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Featured Inventory
            </h2>
            <p className="mt-3 max-w-md text-[0.95rem] text-muted">
              Nine hand-selected vehicles, each inspected and certified
              before it reaches you.
            </p>
          </div>
          <a
            href="#inventory"
            className="text-[0.9rem] font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
          >
            View all inventory
          </a>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
