"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gauge, Settings2, Zap, Fuel, ArrowUpRight } from "lucide-react";
import type { Car } from "@/data/cars";
import { fadeUp } from "@/lib/motion";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const mileageFormat = new Intl.NumberFormat("en-US");

export function CarCard({ car }: { car: Car }) {
  const FuelIcon = car.fuelType === "Electric" ? Zap : Fuel;

  return (
    <motion.article
      variants={fadeUp}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-border-strong"
    >
      <div className="relative h-56 w-full overflow-hidden bg-surface-2">
        <Image
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model} ${car.trim}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.08]"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/90 to-transparent" />
        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[0.75rem] font-medium text-foreground">
          {car.bodyType}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[1.05rem] font-semibold leading-tight text-foreground">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="mt-0.5 text-[0.85rem] text-muted">{car.trim}</p>
          </div>
          <p className="whitespace-nowrap text-[1.05rem] font-semibold text-foreground">
            {currency.format(car.price)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-[0.78rem] text-muted">
          <div className="flex items-center gap-1.5">
            <Gauge size={14} />
            <span>{mileageFormat.format(car.mileage)} mi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 size={14} />
            <span>{car.transmission.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FuelIcon size={14} />
            <span>{car.fuelType}</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-auto flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border-strong text-[0.85rem] font-medium text-foreground transition-colors duration-200 ease-out group-hover:border-foreground/40 group-hover:bg-foreground group-hover:text-accent-foreground"
        >
          View Details
          <ArrowUpRight
            size={15}
            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </motion.article>
  );
}
