"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-[94vh] min-h-[680px] w-full items-center overflow-hidden bg-background"
    >
      <Image
        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=2400&q=80"
        alt="A performance coupe parked on a desert road at dusk, dramatic light on the horizon"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-28 pt-24 lg:px-8"
      >
        <motion.p
          variants={fadeUp}
          className="text-[0.9rem] font-medium text-muted"
        >
          Certified inventory · Nationwide delivery
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-balance max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-[5.25rem]"
        >
          Find Your Next Precision Machine
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="max-w-xl text-lg leading-relaxed text-muted"
        >
          A curated collection of sedans, SUVs, and performance vehicles —
          inspected, certified, and delivered to your door.
        </motion.p>
      </motion.div>
    </section>
  );
}
