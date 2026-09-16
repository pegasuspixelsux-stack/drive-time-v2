"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import type { CarFeatureGroup, FeatureIconKey } from "@/data/car-details";
import { fadeUp, staggerContainer } from "@/lib/motion";

const ICONS: Record<FeatureIconKey, typeof Gauge> = {
  engine: Gauge,
  comfort: Sparkles,
  tech: ShieldCheck,
};

export function FeatureColumns({ features }: { features: CarFeatureGroup[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-3 sm:px-8"
    >
      {features.map((group) => {
        const Icon = ICONS[group.icon];
        return (
          <motion.div
            key={group.category}
            variants={fadeUp}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
              <Icon size={18} />
            </span>
            <h3 className="mt-4 text-[1.05rem] font-semibold text-zinc-900">
              {group.category}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[0.9rem] text-zinc-600"
                >
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 flex-shrink-0 text-zinc-400"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
