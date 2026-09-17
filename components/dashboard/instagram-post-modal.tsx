"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Edit3, X } from "lucide-react";
import type { InventoryItem } from "@/lib/dashboard-data";
import { carDetails, type CarDetailImage } from "@/data/car-details";

type PostPreset = "bottom-left-logo" | "bottom-top-logo" | "all-bottom";

const PRESET_OPTIONS: { id: PostPreset; label: string }[] = [
  { id: "bottom-left-logo", label: "Logo Izquierda" },
  { id: "bottom-top-logo", label: "Logo Arriba" },
  { id: "all-bottom", label: "Todo Abajo" },
];

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const PAYMENT_APR = 6.9;
const PAYMENT_TERM_MONTHS = 60;
const PAYMENT_DOWN_RATE = 0.3;

function estimateMonthlyPayment(price: number) {
  const principal = price * (1 - PAYMENT_DOWN_RATE);
  const monthlyRate = PAYMENT_APR / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, PAYMENT_TERM_MONTHS);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function defaultTitle(item: InventoryItem) {
  return `${item.year} ${item.make} ${item.model}`;
}

function defaultPriceText(item: InventoryItem) {
  return `${currencyPrecise.format(estimateMonthlyPayment(item.price))}/mes`;
}

const CANVAS_SIZE = 1080;
const PADDING = 56;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

interface PresetLayout {
  watermark: { x: number; y: number; align: "left" | "right" };
  textBlock: { titleY: number; priceY: number };
}

const PRESET_LAYOUTS: Record<PostPreset, PresetLayout> = {
  "bottom-top-logo": {
    watermark: { x: CANVAS_SIZE - PADDING, y: PADDING, align: "right" },
    textBlock: { titleY: CANVAS_SIZE - 170, priceY: CANVAS_SIZE - 100 },
  },
  "bottom-left-logo": {
    watermark: { x: PADDING, y: PADDING, align: "left" },
    textBlock: { titleY: CANVAS_SIZE - 170, priceY: CANVAS_SIZE - 100 },
  },
  "all-bottom": {
    // watermark.y is unused for this preset -- generateInstagramGraphic computes it
    // dynamically from the wrapped title's line count so the pill never overlaps a
    // 2-line title (see WATERMARK_TITLE_GAP below).
    watermark: { x: PADDING, y: CANVAS_SIZE - 280, align: "left" },
    textBlock: { titleY: CANVAS_SIZE - 170, priceY: CANVAS_SIZE - 100 },
  },
};

const WATERMARK_FONT_SIZE = 22;
const WATERMARK_PADDING_X = 20;
const WATERMARK_PADDING_Y = 12;
const WATERMARK_PILL_HEIGHT = WATERMARK_FONT_SIZE + WATERMARK_PADDING_Y * 2;
const WATERMARK_TITLE_GAP = 28;
const TITLE_ASCENT_FALLBACK = 46;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  align: "left" | "right",
) {
  const label = "DRIVETIME";
  ctx.font = `600 ${WATERMARK_FONT_SIZE}px system-ui, sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const pillWidth = textWidth + WATERMARK_PADDING_X * 2;
  const pillHeight = WATERMARK_PILL_HEIGHT;
  const pillX = align === "right" ? x - pillWidth : x;
  const pillY = y;

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(label, pillX + WATERMARK_PADDING_X, pillY + pillHeight / 2 + 1);
}

async function generateInstagramGraphic({
  imageSrc,
  title,
  priceText,
  preset,
}: {
  imageSrc: string;
  title: string;
  priceText: string;
  preset: PostPreset;
}): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el lienzo");

  const img = await loadImage(imageSrc);

  const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (CANVAS_SIZE - drawWidth) / 2;
  const offsetY = (CANVAS_SIZE - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  const gradient = ctx.createLinearGradient(0, CANVAS_SIZE * 0.45, 0, CANVAS_SIZE);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.85)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, CANVAS_SIZE * 0.45, CANVAS_SIZE, CANVAS_SIZE * 0.55);

  const layout = PRESET_LAYOUTS[preset];
  const maxTextWidth = CANVAS_SIZE - PADDING * 2;
  const titleFont = "700 58px system-ui, sans-serif";
  const titleLineHeight = 64;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = titleFont;
  const titleLines = wrapText(ctx, title, maxTextWidth).slice(0, 2);
  const titleStartY = layout.textBlock.titleY - (titleLines.length - 1) * titleLineHeight;

  // The "all-bottom" preset stacks the watermark directly above the title, so its
  // vertical position must react to how many lines the title actually wrapped to --
  // a static offset overlaps a 2-line title (e.g. "2023 Land Rover Range Rover Sport").
  // Measure the real ascent of the first title line (ctx.font is still the title font
  // here) and place the pill's bottom edge a fixed gap above the topmost glyph.
  let watermarkY = layout.watermark.y;
  if (preset === "all-bottom") {
    const titleAscent =
      ctx.measureText(titleLines[0] ?? "").actualBoundingBoxAscent || TITLE_ASCENT_FALLBACK;
    const titleTopY = titleStartY - titleAscent;
    watermarkY = titleTopY - WATERMARK_TITLE_GAP - WATERMARK_PILL_HEIGHT;
  }
  drawWatermark(ctx, layout.watermark.x, watermarkY, layout.watermark.align);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = titleFont;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, PADDING, titleStartY + i * titleLineHeight);
  });

  ctx.font = "600 44px system-ui, sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(priceText, PADDING, layout.textBlock.priceY);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen"));
    }, "image/png");
  });
}

// "all-bottom" is intentionally absent here: its watermark renders in-flow above the
// title inside the bottom text block (see the preview markup below), not via a
// separately-positioned absolute class like the other two presets.
const WATERMARK_POSITION_CLASS: Record<Exclude<PostPreset, "all-bottom">, string> = {
  "bottom-top-logo": "top-3 right-3",
  "bottom-left-logo": "top-3 left-3",
};

const PRESET_DOT_CLASS: Record<PostPreset, string> = {
  "bottom-top-logo": "right-1 top-1",
  "bottom-left-logo": "left-1 top-1",
  "all-bottom": "bottom-2 left-1",
};

export function InstagramPostModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}) {
  const gallery = useMemo<CarDetailImage[]>(() => {
    if (!item) return [];
    const detail = carDetails[item.id];
    if (detail && detail.images.length > 0) return detail.images;
    return [{ src: item.image, alt: `${item.make} ${item.model}` }];
  }, [item]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [priceText, setPriceText] = useState("");
  const [preset, setPreset] = useState<PostPreset>("bottom-top-logo");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !item) return;
    setSelectedImageIndex(0);
    setTitle(defaultTitle(item));
    setPriceText(defaultPriceText(item));
    setPreset("bottom-top-logo");
    setError(null);
  }, [open, item]);

  if (!item) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const blob = await generateInstagramGraphic({
        imageSrc: gallery[selectedImageIndex]?.src ?? item.image,
        title,
        priceText,
        preset,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify(`${item.year}-${item.make}-${item.model}`)}-instagram-post.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      setError("No se pudo generar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const activeImage = gallery[selectedImageIndex] ?? { src: item.image, alt: item.model };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Generador de Publicación para Instagram
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <div className="mx-auto w-full max-w-[420px]">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {preset !== "all-bottom" && (
                    <span
                      className={`absolute flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-900 ${WATERMARK_POSITION_CLASS[preset]}`}
                    >
                      DRIVETIME
                    </span>
                  )}

                  <div className="absolute inset-x-4 bottom-4">
                    {preset === "all-bottom" && (
                      <span className="mb-2 inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-900">
                        DRIVETIME
                      </span>
                    )}
                    <p className="line-clamp-2 text-xl font-bold leading-tight text-white">
                      {title}
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-200">{priceText}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <Edit3 size={13} />
                    Título
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus-visible:border-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600">Precio / Cuota</label>
                  <input
                    value={priceText}
                    onChange={(e) => setPriceText(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus-visible:border-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600">Diseño</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPreset(option.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-2 transition-colors ${
                          preset === option.id
                            ? "border-indigo-500 ring-2 ring-indigo-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-200">
                          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-400/60" />
                          <span
                            className={`absolute h-2 w-4 rounded-sm bg-white ${PRESET_DOT_CLASS[option.id]}`}
                          />
                          <span className="absolute bottom-1 left-1 h-1 w-6 rounded-sm bg-white/90" />
                        </span>
                        <span className="text-[0.7rem] font-medium text-slate-600">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600">Fotos del vehículo</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {gallery.map((image, index) => (
                      <button
                        key={image.src + index}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                          index === selectedImageIndex
                            ? "border-indigo-500"
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={16} />
                  {isGenerating ? "Generando..." : "Descargar Imagen Final"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
