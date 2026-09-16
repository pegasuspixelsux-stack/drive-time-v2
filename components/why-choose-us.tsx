"use client";

import { motion } from "framer-motion";
import { HandCoins, LifeBuoy, ShieldCheck, Tag } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Certified Inspections",
    description:
      "Every vehicle passes a 150-point multi-system inspection before it ever reaches our lot.",
  },
  {
    icon: Tag,
    title: "Transparent Pricing",
    description:
      "No hidden fees, no last-minute markups — the price you see is the price you pay.",
  },
  {
    icon: HandCoins,
    title: "Zero-Pressure Financing",
    description:
      "Explore financing options at your own pace, with terms built around your budget.",
  },
  {
    icon: LifeBuoy,
    title: "Lifetime Support",
    description:
      "Complimentary checkups and priority scheduling for as long as you own your DriveTime vehicle.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="bg-background px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col justify-center gap-6"
        >
          <motion.p variants={fadeUp} className="text-[0.9rem] font-medium text-muted">
            Why Choose DriveTime
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Driven by Quality, Defined by Trust
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-lg text-[0.98rem] leading-relaxed text-muted">
            Every vehicle in our collection is put through a rigorous
            multi-point inspection long before it&rsquo;s listed — because
            trust is earned in the details you never have to think about.
            We price transparently, explain every option in plain language,
            and build financing around your life, not our quota.
          </motion.p>
          <motion.p variants={fadeUp} className="max-w-lg text-[0.98rem] leading-relaxed text-muted">
            From your first test drive to years down the road, our team
            stays reachable — so buying a car feels less like a negotiation
            and more like a decision you can make with confidence.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface/60 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-strong hover:bg-surface"
            >
              <span className="glass flex h-11 w-11 items-center justify-center rounded-xl text-foreground">
                <Icon size={20} />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[0.98rem] font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-[0.85rem] leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
