"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Edit3, ImageUp, Minus, Plus, RotateCcw, X } from "lucide-react";
import type { InventoryItem } from "@/lib/dashboard-data";
import { carDetails, type CarDetailImage } from "@/data/car-details";

type PostPreset = "bottom-left-logo" | "bottom-top-logo" | "all-bottom";
type PostFormat = "square" | "feed" | "story";
type GradientTheme = "dark" | "light";

const PRESET_OPTIONS: { id: PostPreset; label: string }[] = [
  { id: "bottom-left-logo", label: "Logo Izquierda" },
  { id: "bottom-top-logo", label: "Logo Arriba" },
  { id: "all-bottom", label: "Todo Abajo" },
];

const FORMAT_OPTIONS: {
  id: PostFormat;
  label: string;
  width: number;
  height: number;
  aspectClass: string;
}[] = [
  { id: "square", label: "Cuadrado", width: 1080, height: 1080, aspectClass: "aspect-square" },
  { id: "feed", label: "Feed 4:5", width: 1080, height: 1350, aspectClass: "aspect-[4/5]" },
  { id: "story", label: "Historia 9:16", width: 1080, height: 1920, aspectClass: "aspect-[9/16]" },
];

const GRADIENT_OPTIONS: { id: GradientTheme; label: string }[] = [
  { id: "dark", label: "Oscuro" },
  { id: "light", label: "Claro" },
];

const GRADIENT_INTENSITY_MIN = 40;
const GRADIENT_INTENSITY_MAX = 100;
const GRADIENT_INTENSITY_STEP = 10;
const GRADIENT_INTENSITY_DEFAULT = 100;

const FUEL_TYPE_LABELS: Record<string, string> = {
  Gasoline: "Nafta",
  Hybrid: "Híbrido",
  Electric: "Eléctrico",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const mileageFormat = new Intl.NumberFormat("en-US");

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

const PADDING = 56;

// The dealership's brand mark, pulled from the global system configuration. Staff can
// override it per-graphic (see "Identidad de Marca") without touching this default.
const DEFAULT_LOGO_SRC = "/drivetime-logo.svg";
const LOGO_MAX_WIDTH = 220;
const LOGO_MAX_HEIGHT = 64;
const LOGO_GAP = 28;

const FOOTER_STRIPE_HEIGHT = 64;
const FOOTER_STRIPE_TEXT = "Visítenos @drivetime";

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

// Fits an image within a box, preserving aspect ratio (equivalent to object-fit: contain).
function fitContain(naturalWidth: number, naturalHeight: number, maxWidth: number, maxHeight: number) {
  const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
  return { width: naturalWidth * ratio, height: naturalHeight * ratio };
}

// Draws the brand logo fit-contain within LOGO_MAX_WIDTH x LOGO_MAX_HEIGHT, anchored at
// (x, y) — y is the box's TOP edge, x is the left/right anchor per `align`. Returns the box
// actually drawn so callers with height-dependent layout (the "all-bottom" preset) can react.
function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  x: number,
  y: number,
  align: "left" | "right",
): { width: number; height: number } {
  const box = fitContain(logoImg.width, logoImg.height, LOGO_MAX_WIDTH, LOGO_MAX_HEIGHT);
  const drawX = align === "right" ? x - box.width : x;
  ctx.drawImage(logoImg, drawX, y, box.width, box.height);
  return box;
}

// A solid opaque band pinned to the true canvas bottom, drawn dead last so it always sits
// on top of the image/gradient/preset content. Every preset's bottom-anchored math is
// computed against `contentBottom` (canvasHeight - FOOTER_STRIPE_HEIGHT), not the raw
// canvas height, so nothing is ever drawn underneath this stripe in the first place. Carries
// both the dealer tagline (left) and "Link in Bio" (right) -- the single shared home for
// both across all three presets, so no preset draws its own separate "Link in Bio" anymore.
function drawFooterStripe(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  ctx.fillStyle = isDark ? "#000000" : "#ffffff";
  ctx.fillRect(0, height - FOOTER_STRIPE_HEIGHT, width, FOOTER_STRIPE_HEIGHT);

  const textColor = isDark ? "#ffffff" : "#0f172a";
  const stripeCenterY = height - FOOTER_STRIPE_HEIGHT / 2 + 1;
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillStyle = textColor;
  ctx.textBaseline = "middle";

  ctx.textAlign = "left";
  ctx.fillText(FOOTER_STRIPE_TEXT, PADDING, stripeCenterY);

  ctx.textAlign = "right";
  ctx.fillText("Link in Bio", width - PADDING, stripeCenterY);
}

interface PresetLayout {
  logo: { x: number; y: number; align: "left" | "right" };
  textBlock: { titleY: number; priceY: number };
}

// Only used by the "bottom-top-logo" and "all-bottom" presets — "bottom-left-logo" has an
// entirely bespoke layout (see drawPreset1/the preset1 preview branch) and never reads this.
function getPresetLayout(
  preset: Exclude<PostPreset, "bottom-left-logo">,
  width: number,
  height: number,
): PresetLayout {
  const textBlock = { titleY: height - 170, priceY: height - 100 };
  if (preset === "bottom-top-logo") {
    return { logo: { x: width - PADDING, y: PADDING, align: "right" }, textBlock };
  }
  // "all-bottom": logo.y is unused here -- generateInstagramGraphic computes it
  // dynamically from the wrapped title's line count so the logo never overlaps a
  // 2-line title (see LOGO_GAP below).
  return { logo: { x: PADDING, y: height - 280, align: "left" }, textBlock };
}

const TITLE_ASCENT_FALLBACK = 46;

/**
 * Preset 1 ("bottom-left-logo"): a bespoke, entirely bottom-up layout. Every block's
 * position is derived from the block below it's own actual measured edge — never from a
 * static Y value that a sibling separately "compensates" for — so wrapping text can never
 * silently desync two unrelated blocks (the exact bug class the "all-bottom" preset hit
 * earlier: a title wrapping to 2 lines pushed a *different* element by a duplicated offset).
 */
function drawPreset1(
  ctx: CanvasRenderingContext2D,
  {
    width,
    height,
    item,
    priceText,
    logoImg,
    primaryColor,
    secondaryColor,
  }: {
    width: number;
    height: number;
    item: InventoryItem;
    priceText: string;
    logoImg: HTMLImageElement;
    primaryColor: string;
    secondaryColor: string;
  },
) {
  const maxTextWidth = width - PADDING * 2;

  // --- Top brand header: the logo, left-aligned (matches this preset's "Logo Izquierda"
  // identity). "Link in Bio" now lives on the shared footer stripe (see drawFooterStripe),
  // not here.
  drawLogo(ctx, logoImg, PADDING, PADDING, "left");

  // --- Bottom content, built bottom-up. This stack's bottom-most element is row 2.
  const row2Font = "600 32px system-ui, sans-serif";
  const paymentFont = "700 46px system-ui, sans-serif";
  const totalFont = "500 26px system-ui, sans-serif";
  const row1Font = "800 62px system-ui, sans-serif";
  const row1LineHeight = 68;
  const row1Gap = 28;

  const row2BaselineY = height - PADDING + 4;

  const totalPriceText = currency.format(item.price);
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.font = paymentFont;
  ctx.fillStyle = primaryColor;
  ctx.fillText(priceText, width - PADDING, row2BaselineY);
  ctx.font = totalFont;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(totalPriceText, width - PADDING, row2BaselineY + 34);

  const fuelLabel = FUEL_TYPE_LABELS[item.fuelType] ?? item.fuelType;
  const leftSegments = [String(item.year), `${mileageFormat.format(item.mileage)} km`, fuelLabel];
  ctx.font = row2Font;
  ctx.fillStyle = secondaryColor;
  ctx.textAlign = "left";
  let cursorX = PADDING;
  leftSegments.forEach((segment, index) => {
    const text = index < leftSegments.length - 1 ? `${segment}  |  ` : segment;
    ctx.fillText(text, cursorX, row2BaselineY);
    cursorX += ctx.measureText(text).width;
  });

  const row2Ascent = ctx.measureText(leftSegments[0]).actualBoundingBoxAscent || 28;
  const row2TopY = row2BaselineY - row2Ascent;

  // Row 1 (make + model) sits a fixed gap above row 2's top edge, and self-compensates
  // for wrapping to 2 lines the same way the original title block did — but critically,
  // nothing else on the canvas reads titleLines.length, so there is nothing left to
  // accidentally double-compensate.
  ctx.font = row1Font;
  const titleLines = wrapText(ctx, `${item.make} ${item.model}`, maxTextWidth).slice(0, 2);
  const lastLine = titleLines[titleLines.length - 1] ?? "";
  const lastLineMetrics = ctx.measureText(lastLine);
  const row1Descent = lastLineMetrics.actualBoundingBoxDescent || 14;
  const row1LastLineBaselineY = row2TopY - row1Gap - row1Descent;
  const row1StartY = row1LastLineBaselineY - (titleLines.length - 1) * row1LineHeight;

  ctx.fillStyle = primaryColor;
  ctx.textAlign = "left";
  titleLines.forEach((line, i) => {
    ctx.fillText(line, PADDING, row1StartY + i * row1LineHeight);
  });
}

async function generateInstagramGraphic({
  imageSrc,
  logoSrc,
  title,
  priceText,
  preset,
  format,
  gradientTheme,
  gradientIntensity,
  item,
}: {
  imageSrc: string;
  logoSrc: string;
  title: string;
  priceText: string;
  preset: PostPreset;
  format: PostFormat;
  gradientTheme: GradientTheme;
  gradientIntensity: number;
  item: InventoryItem;
}): Promise<Blob> {
  const { width, height } = FORMAT_OPTIONS.find((f) => f.id === format) ?? FORMAT_OPTIONS[0];

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el lienzo");

  const [img, logoImg] = await Promise.all([loadImage(imageSrc), loadImage(logoSrc)]);

  const scale = Math.max(width / img.width, height / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  const isDark = gradientTheme === "dark";
  const gradTop = height * 0.45;
  const gradientRgb = isDark ? "0, 0, 0" : "255, 255, 255";
  const gradientAlpha = gradientIntensity / 100;
  const gradient = ctx.createLinearGradient(0, gradTop, 0, height);
  gradient.addColorStop(0, `rgba(${gradientRgb}, 0)`);
  gradient.addColorStop(1, `rgba(${gradientRgb}, ${gradientAlpha})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, gradTop, width, height - gradTop);

  const primaryColor = isDark ? "#ffffff" : "#0f172a";
  const secondaryColor = isDark ? "#e2e8f0" : "#334155";

  // Every bottom-anchored element in every preset positions itself against contentBottom,
  // not the raw canvas height, leaving a clear FOOTER_STRIPE_HEIGHT band for the stripe
  // drawn at the very end -- nothing above ever needs to know the stripe exists.
  const contentBottom = height - FOOTER_STRIPE_HEIGHT;

  if (preset === "bottom-left-logo") {
    drawPreset1(ctx, { width, height: contentBottom, item, priceText, logoImg, primaryColor, secondaryColor });
  } else {
    const layout = getPresetLayout(preset, width, contentBottom);
    const maxTextWidth = width - PADDING * 2;
    const titleFont = "700 58px system-ui, sans-serif";
    const titleLineHeight = 64;

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = titleFont;
    const titleLines = wrapText(ctx, title, maxTextWidth).slice(0, 2);
    const titleStartY = layout.textBlock.titleY - (titleLines.length - 1) * titleLineHeight;

    // The "all-bottom" preset stacks the logo directly above the title, so its vertical
    // position must react to how many lines the title actually wrapped to -- a static
    // offset overlaps a 2-line title (e.g. "2023 Land Rover Range Rover Sport"). Measure
    // the real ascent of the first title line (ctx.font is still the title font here) and
    // place the logo's bottom edge a fixed gap above the topmost glyph.
    let logoY = layout.logo.y;
    if (preset === "all-bottom") {
      const titleAscent =
        ctx.measureText(titleLines[0] ?? "").actualBoundingBoxAscent || TITLE_ASCENT_FALLBACK;
      const titleTopY = titleStartY - titleAscent;
      const logoBoxHeight = fitContain(logoImg.width, logoImg.height, LOGO_MAX_WIDTH, LOGO_MAX_HEIGHT).height;
      logoY = titleTopY - LOGO_GAP - logoBoxHeight;
    }
    drawLogo(ctx, logoImg, layout.logo.x, logoY, layout.logo.align);

    ctx.fillStyle = primaryColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = titleFont;
    titleLines.forEach((line, i) => {
      ctx.fillText(line, PADDING, titleStartY + i * titleLineHeight);
    });

    ctx.font = "600 44px system-ui, sans-serif";
    ctx.fillStyle = secondaryColor;
    ctx.fillText(priceText, PADDING, layout.textBlock.priceY);
  }

  drawFooterStripe(ctx, width, height, isDark);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen"));
    }, "image/png");
  });
}

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
  const [format, setFormat] = useState<PostFormat>("square");
  const [gradientTheme, setGradientTheme] = useState<GradientTheme>("dark");
  const [gradientIntensity, setGradientIntensity] = useState(GRADIENT_INTENSITY_DEFAULT);
  const [logoSrc, setLogoSrc] = useState(DEFAULT_LOGO_SRC);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !item) return;
    setSelectedImageIndex(0);
    setTitle(defaultTitle(item));
    setPriceText(defaultPriceText(item));
    setPreset("bottom-top-logo");
    setFormat("square");
    setGradientTheme("dark");
    setGradientIntensity(GRADIENT_INTENSITY_DEFAULT);
    setLogoSrc(DEFAULT_LOGO_SRC);
    setError(null);
  }, [open, item]);

  if (!item) return null;

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setLogoSrc(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const blob = await generateInstagramGraphic({
        imageSrc: gallery[selectedImageIndex]?.src ?? item.image,
        logoSrc,
        title,
        priceText,
        preset,
        format,
        gradientTheme,
        gradientIntensity,
        item,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify(`${item.year}-${item.make}-${item.model}`)}-${format}-instagram-post.png`;
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
  const activeFormat = FORMAT_OPTIONS.find((f) => f.id === format) ?? FORMAT_OPTIONS[0];
  const isDark = gradientTheme === "dark";
  const primaryTextClass = isDark ? "text-white" : "text-slate-900";
  const secondaryTextClass = isDark ? "text-slate-200" : "text-slate-600";
  const mutedTextClass = isDark ? "text-slate-300" : "text-slate-500";
  const fuelLabel = FUEL_TYPE_LABELS[item.fuelType] ?? item.fuelType;

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
                <div
                  className={`relative w-full max-h-[70vh] overflow-hidden rounded-2xl bg-slate-100 ${activeFormat.aspectClass}`}
                >
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-2/3"
                    style={{
                      background: `linear-gradient(to top, rgba(${
                        isDark ? "0, 0, 0" : "255, 255, 255"
                      }, ${gradientIntensity / 100}) 0%, transparent 100%)`,
                    }}
                  />

                  {preset === "bottom-left-logo" ? (
                    <>
                      <img
                        src={logoSrc}
                        alt="Logo"
                        className="absolute left-3 top-3 h-8 max-w-[140px] object-contain object-left"
                      />
                      <div className="absolute inset-x-4 bottom-11 flex flex-col gap-1.5">
                        <p className={`line-clamp-2 text-2xl font-extrabold leading-tight ${primaryTextClass}`}>
                          {item.make} {item.model}
                        </p>
                        <div className="flex items-end justify-between gap-3">
                          <p className={`text-sm font-semibold ${secondaryTextClass}`}>
                            {item.year} | {mileageFormat.format(item.mileage)} km | {fuelLabel}
                          </p>
                          <div className="text-right">
                            <p className={`text-lg font-bold leading-none ${primaryTextClass}`}>
                              {priceText}
                            </p>
                            <p className={`mt-1 text-xs ${mutedTextClass}`}>
                              {currency.format(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {preset === "bottom-top-logo" && (
                        <img
                          src={logoSrc}
                          alt="Logo"
                          className="absolute right-3 top-3 h-8 max-w-[140px] object-contain object-right"
                        />
                      )}

                      <div className="absolute inset-x-4 bottom-11">
                        {preset === "all-bottom" && (
                          <img src={logoSrc} alt="Logo" className="mb-2 h-8 max-w-[140px] object-contain object-left" />
                        )}
                        <p className={`line-clamp-2 text-xl font-bold leading-tight ${primaryTextClass}`}>
                          {title}
                        </p>
                        <p className={`mt-1 text-base font-semibold ${secondaryTextClass}`}>
                          {priceText}
                        </p>
                      </div>
                    </>
                  )}

                  <div
                    className={`absolute inset-x-0 bottom-0 flex h-7 items-center justify-between px-3 text-[0.6rem] font-semibold ${
                      isDark ? "bg-black text-white" : "bg-white text-slate-900"
                    }`}
                  >
                    <span>Visítenos @drivetime</span>
                    <span>Link in Bio</span>
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
                  <label className="text-sm font-medium text-slate-600">Identidad de Marca</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                    <div className="flex h-12 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      <img src={logoSrc} alt="Logo actual" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => setLogoSrc(DEFAULT_LOGO_SRC)}
                        className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                      >
                        <RotateCcw size={12} />
                        Usar Logo Predeterminado
                      </button>
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                      >
                        <ImageUp size={12} />
                        Subir Nuevo Logo
                      </button>
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600">Formato</label>
                  <div className="grid grid-cols-3 gap-2">
                    {FORMAT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormat(option.id)}
                        className={`rounded-xl border px-2 py-2 text-[0.75rem] font-medium transition-colors ${
                          format === option.id
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600">Tono del degradado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setGradientTheme(option.id)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                          gradientTheme === option.id
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full border border-slate-300 ${
                            option.id === "dark" ? "bg-slate-900" : "bg-white"
                          }`}
                        />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600">Intensidad del Degradado</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        setGradientIntensity((v) => Math.max(GRADIENT_INTENSITY_MIN, v - GRADIENT_INTENSITY_STEP))
                      }
                      disabled={gradientIntensity <= GRADIENT_INTENSITY_MIN}
                      aria-label="Disminuir intensidad"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center text-sm font-medium text-slate-900">
                      {gradientIntensity}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGradientIntensity((v) => Math.min(GRADIENT_INTENSITY_MAX, v + GRADIENT_INTENSITY_STEP))
                      }
                      disabled={gradientIntensity >= GRADIENT_INTENSITY_MAX}
                      aria-label="Aumentar intensidad"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
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
