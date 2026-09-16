"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { FinanceCalculator } from "@/components/finance-calculator";
import { TradeInForm } from "@/components/trade-in-form";

const TABS = [
  { key: "calculator", label: "Financial Calculator" },
  { key: "trade-in", label: "Value Your Trade-In" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function FinanceTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("calculator");

  return (
    <section id="financing" className="bg-background px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-[0.9rem] font-medium text-muted">Plan Your Purchase</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Estimate Payments or Value a Trade-In
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="glass rounded-[28px] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:p-10"
        >
          <div className="relative mb-8 flex w-full gap-1 rounded-full border border-border bg-surface/60 p-1 sm:w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 rounded-full px-5 py-2.5 text-[0.85rem] font-medium transition-colors duration-200 sm:flex-none ${
                  activeTab === tab.key
                    ? "text-accent-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.span
                    layoutId="finance-active-tab"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === "calculator" ? <FinanceCalculator /> : <TradeInForm />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
