"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { FinanceCalculator } from "@/components/finance-calculator";
import { TradeInForm } from "@/components/trade-in-form";

export function FinanceTabs() {
  return (
    <section id="financing" className="bg-background px-3 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-[0.9rem] font-medium text-muted">Plan Your Purchase</p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Estimate Payments or Value a Trade-In
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          <motion.div
            variants={fadeUp}
            className="glass rounded-[28px] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:p-10"
          >
            <h3 className="mb-6 text-[1.05rem] font-semibold text-foreground">
              Financial Calculator
            </h3>
            <FinanceCalculator />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="glass rounded-[28px] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:p-10"
          >
            <h3 className="mb-6 text-[1.05rem] font-semibold text-foreground">
              Value Your Trade-In
            </h3>
            <TradeInForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
