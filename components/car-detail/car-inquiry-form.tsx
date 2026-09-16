"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import type { Car } from "@/data/cars";
import { fadeUp } from "@/lib/motion";

const WHATSAPP_NUMBER = "14155550148";

const fieldClass =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[0.9rem] text-zinc-900 placeholder:text-zinc-400 transition-colors duration-200 focus-visible:border-zinc-900 focus-visible:outline-none";

interface InquiryDraft {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_DRAFT: InquiryDraft = { name: "", email: "", phone: "", message: "" };

function buildWhatsAppUrl(car: Car, draft: InquiryDraft) {
  const carLabel = `${car.year} ${car.make} ${car.model}`;
  const lines = [
    `Hi, I'm interested in the ${carLabel}.`,
    draft.name && `My name is ${draft.name}.`,
    draft.email && `Email: ${draft.email}`,
    draft.message,
  ].filter(Boolean);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join(" "))}`;
}

export function CarInquiryForm({ car }: { car: Car }) {
  const [draft, setDraft] = useState<InquiryDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryDraft, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: Partial<Record<keyof InquiryDraft, string>> = {};
    if (!draft.name.trim()) nextErrors.name = "Name is required";
    if (!draft.email.trim()) nextErrors.email = "Email is required";
    if (!draft.message.trim()) nextErrors.message = "Message is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleWhatsAppSubmit = () => {
    if (!validate()) return;
    window.open(buildWhatsAppUrl(car, draft), "_blank", "noreferrer");
  };

  if (submitted) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-[1000px] px-6 py-14 sm:px-8"
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
            <CheckCircle2 size={22} />
          </span>
          <h3 className="text-[1.05rem] font-semibold text-zinc-900">
            Inquiry received
          </h3>
          <p className="text-[0.9rem] text-zinc-500">
            An advisor will follow up about the {car.year} {car.make} {car.model}{" "}
            shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setDraft(EMPTY_DRAFT);
              setSubmitted(false);
            }}
            className="mt-2 text-[0.85rem] font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
          >
            Send another inquiry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-[1000px] px-6 py-14 sm:px-8"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Interested in this vehicle?
        </h2>
        <p className="mt-2 text-[0.9rem] text-zinc-500">
          Send an inquiry and an advisor will get back to you.
        </p>

        <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[0.8rem] font-medium text-zinc-600">Name</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Jordan Avery"
                className={fieldClass}
              />
              {errors.name && <p className="text-[0.78rem] text-red-500">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8rem] font-medium text-zinc-600">Email</label>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                placeholder="you@email.com"
                className={fieldClass}
              />
              {errors.email && <p className="text-[0.78rem] text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.8rem] font-medium text-zinc-600">Phone</label>
            <input
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              placeholder="(415) 555-0148"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.8rem] font-medium text-zinc-600">Message</label>
            <textarea
              value={draft.message}
              onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
              placeholder={`I'd like to know more about the ${car.year} ${car.make} ${car.model}...`}
              rows={4}
              className={`${fieldClass} h-auto resize-none py-3`}
            />
            {errors.message && (
              <p className="text-[0.78rem] text-red-500">{errors.message}</p>
            )}
          </div>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-900 text-[0.9rem] font-medium text-white transition-colors hover:bg-zinc-800"
            >
              <Send size={16} />
              Submit by Email
            </motion.button>
            <motion.button
              type="button"
              onClick={handleWhatsAppSubmit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-[0.9rem] font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <MessageCircle size={16} />
              Submit by WhatsApp
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
