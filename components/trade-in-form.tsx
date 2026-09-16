"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FormField, FormInput, FormSelect } from "@/components/form-controls";

const CONDITIONS = ["Excellent", "Good", "Fair", "Needs Work"];

export function TradeInForm() {
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 py-14 text-center"
      >
        <span className="glass flex h-12 w-12 items-center justify-center rounded-full text-foreground">
          <CheckCircle2 size={22} />
        </span>
        <h3 className="text-[1.05rem] font-semibold text-foreground">
          Estimate request received
        </h3>
        <p className="max-w-sm text-[0.9rem] text-muted">
          An advisor will reach out with your trade-in valuation within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-[0.85rem] font-medium text-foreground underline decoration-border-strong underline-offset-4"
        >
          Submit another vehicle
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="trade-in-form"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Make">
            <FormInput required placeholder="e.g. BMW" name="make" />
          </FormField>
          <FormField label="Model">
            <FormInput required placeholder="e.g. M5" name="model" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Year">
            <FormInput
              required
              type="number"
              placeholder="e.g. 2021"
              min={1980}
              max={2027}
              name="year"
            />
          </FormField>
          <FormField label="Mileage">
            <FormInput
              required
              type="number"
              placeholder="e.g. 32,000"
              min={0}
              name="mileage"
            />
          </FormField>
        </div>

        <FormField label="Overall Condition">
          <FormSelect
            options={CONDITIONS}
            value={condition}
            onChange={setCondition}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Full Name">
            <FormInput required placeholder="Jordan Avery" name="name" />
          </FormField>
          <FormField label="Email">
            <FormInput
              required
              type="email"
              placeholder="you@email.com"
              name="email"
            />
          </FormField>
        </div>

        <FormField label="Phone">
          <FormInput
            required
            type="tel"
            placeholder="(415) 555-0148"
            name="phone"
          />
        </FormField>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="mt-2 flex h-12 items-center justify-center rounded-xl bg-foreground text-[0.9rem] font-medium text-accent-foreground"
        >
          Get My Trade-In Estimate
        </motion.button>
      </motion.form>
    </AnimatePresence>
  );
}
