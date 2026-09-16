"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { FormField, FormSelect } from "@/components/form-controls";

const MAKES = [
  "Any Make",
  "Land Rover",
  "BMW",
  "Porsche",
  "Tesla",
  "Honda",
  "Nissan",
  "Ford",
  "Mercedes-AMG",
  "Lamborghini",
];

const PRICE_RANGES = [
  "Any Price",
  "Under $70,000",
  "$70,000 – $100,000",
  "$100,000 – $150,000",
  "$150,000+",
];

const BODY_TYPES = ["Any Body Type", "Sedan", "SUV", "Coupe"];

export function SearchFilter() {
  const [make, setMake] = useState(MAKES[0]);
  const [price, setPrice] = useState(PRICE_RANGES[0]);
  const [bodyType, setBodyType] = useState(BODY_TYPES[0]);

  const handleSearch = () => {
    document
      .getElementById("inventory")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="glass rounded-[28px] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end lg:gap-4">
        <FormField label="Make / Model">
          <FormSelect options={MAKES} value={make} onChange={setMake} />
        </FormField>

        <FormField label="Price Range">
          <FormSelect
            options={PRICE_RANGES}
            value={price}
            onChange={setPrice}
          />
        </FormField>

        <FormField label="Body Type">
          <FormSelect
            options={BODY_TYPES}
            value={bodyType}
            onChange={setBodyType}
          />
        </FormField>

        <motion.button
          type="button"
          onClick={handleSearch}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 text-[0.9rem] font-medium text-accent-foreground"
        >
          <Search size={16} />
          Search Inventory
        </motion.button>
      </div>
    </motion.div>
  );
}
