import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/* Nama ukuran → CSS variable di @theme (globals.css) */
const textSizes = {
  "display-3xl": "--text-display-3xl",
  "display-2xl": "--text-display-2xl",
  "display-xl": "--text-display-xl",
  "display-lg": "--text-display-lg",
  "display-md": "--text-display-md",
  "display-sm": "--text-display-sm",
  "display-xs": "--text-display-xs",
  "text-xl": "--text-xl",
  "text-lg": "--text-lg",
  "text-md": "--text-md",
  "text-sm": "--text-sm",
  "text-xs": "--text-xs",
} as const;

/* Nama ketebalan → CSS variable di @theme (globals.css) */
const fontWeights = {
  regular: "--font-weight-regular",
  medium: "--font-weight-medium",
  semibold: "--font-weight-semibold",
  bold: "--font-weight-bold",
  extrabold: "--font-weight-extrabold",
} as const;

/* Membuat class gabungan seperti .display-3xl-bold, .text-md-regular, dst. */
const customTextPlugin = plugin(({ addUtilities }) => {
  const newUtilities: Record<string, Record<string, string>> = {};

  for (const [sizeName, sizeVar] of Object.entries(textSizes)) {
    for (const [weightName, weightVar] of Object.entries(fontWeights)) {
      const className = `.${sizeName}-${weightName}`;
      newUtilities[className] = {
        fontSize: `var(${sizeVar})`,
        lineHeight: `var(${sizeVar}--line-height)`,
        letterSpacing: `var(${sizeVar}--letter-spacing, normal)`,
        fontWeight: `var(${weightVar})`,
      };
    }
  }

  addUtilities(newUtilities);
});

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  plugins: [customTextPlugin],
} satisfies Config;
