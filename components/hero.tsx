"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=2400&q=80",
    alt: "A performance coupe parked on a desert road at dusk, dramatic light on the horizon",
  },
  {
    src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2400&q=80",
    alt: "A sports car with headlights on, driving through the city at night",
  },
  {
    src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=2400&q=80",
    alt: "A luxury sedan parked in front of a modern glass building",
  },
  {
    src: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&w=2400&q=80",
    alt: "A sports car cruising down an open highway at speed",
  },
];

const SLIDE_INTERVAL = 6000;

export function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((current) => (current + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative flex h-[50vh] min-h-[420px] w-full items-end overflow-hidden bg-background sm:h-[80vh] sm:min-h-[580px]"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[slide].src}
            alt={SLIDES[slide].alt}
            fill
            priority={slide === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {SLIDES.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === slide
                ? "w-6 bg-foreground"
                : "w-1.5 bg-foreground/40 hover:bg-foreground/70"
            }`}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 pb-16 pt-14 sm:gap-6 sm:pb-36 sm:pt-24 lg:px-8"
      >
        <motion.p
          variants={fadeUp}
          className="text-[0.9rem] font-medium text-muted"
        >
          Certified inventory · Nationwide delivery
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-balance max-w-3xl text-3xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl sm:leading-[0.98] lg:text-[5.25rem]"
        >
          Find Your Next Precision Machine
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="hidden max-w-xl text-lg leading-relaxed text-muted sm:block"
        >
          A curated collection of sedans, SUVs, and performance vehicles —
          inspected, certified, and delivered to your door.
        </motion.p>
      </motion.div>
    </section>
  );
}
