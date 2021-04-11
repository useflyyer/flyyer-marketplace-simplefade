import React from "react"
import { TemplateProps } from "@flayyer/flayyer-types";
import { useGoogleFonts } from "@flayyer/use-googlefonts";
import clsx from "clsx";
import useFitText from "use-fit-text";
import { useSmartcrop } from "use-smartcrop";

import "../styles/tailwind.css";
import logoOutline from "../static/logo.svg";

import { Layer } from "../components/Layer";
import { getPreferredModeFromPalette } from "../utils/color";

// Make sure to 'export default' a React component
export default function ArticleTemplate({ width, height, lang = "en", variables }: TemplateProps) {
  const {
    title = "Create images with React.js",
    description = "Take control over the content and add custom logic using queryparams as props 🚀",
    date = new Date().toISOString(),
    img = "https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    fonts = ["Inter"],
  } = variables;
  const { fontSize, ref } = useFitText({ minFontSize: 20, maxFontSize: 100 });
  const fontsParsed: string[] = (Array.isArray(fonts) ? fonts : [fonts]).filter(Boolean);
  const font = useGoogleFonts(fontsParsed.map(f => ({
    family: f,
    styles: [400, 600],
  })));

  const dateParsed = Date.parse(date); // in ms
  const formatter = new Intl.DateTimeFormat(lang, { dateStyle: "long" } as any);

  const image = useSmartcrop(img, { width, height, minScale: 1.0 });
  const palette = image.getPalette({ height: height / 3 });
  const scheme =  getPreferredModeFromPalette(palette, "dark");

  return (
    <div
      className={clsx([
        "relative w-full h-full antialiased overflow-hidden",
        { "dark": scheme === "dark", "flayyer-ready": font.status && image.status },
      ])}
      style={{ fontFamily: fontsParsed.join(", ") }}
    >
      <Layer>
        <img
          src={image.src}
          crossOrigin=""
          className="w-full h-full bg-white dark:bg-black"
        />
      </Layer>
      <Layer className={clsx("bg-gradient-to-b from-white dark:from-black bottom-3/4 story:bottom-1/2 opacity-0 banner:opacity-50")} />
      <Layer className={clsx("bg-gradient-to-t from-white dark:from-black top-3/4 opacity-0 banner:opacity-30")} />

      <Layer className={clsx([
        "grid grid-cols-12 grid-rows-12 auto-rows-fr auto-cols-fr",
        "p-2 banner:p-3 sq:p-4 story:py-storysafe", // use Instagram safe-zone
      ])}>
        <header className={clsx([
          "hidden banner:flex flex-col",
          "col-span-full row-span-4 sq:row-span-8",
          "text-gray-900 dark:text-white",
        ])}>
          {isFinite(dateParsed) && (
            <time className="block text-gray-800 dark:text-gray-100 opacity-90 text-xs tracking-tight">{formatter.format(dateParsed)}</time>
          )}

          <h1 className={clsx([
            "text-lg text-shadow-md sq:text-2xl story:text-3xl font-semibold",
            "banner:leading-tight sq:leading-tight story:leading-tight", // force override `line-height` from text-X
            "flex-shrink-0 flex-grow-0", // prevent shirking
            "overflow-hidden overflow-ellipsis", // Not working?
          ])}>
            {title}
          </h1>

          <p ref={ref} className={clsx([
            "mt-2",
            "hidden sq:block",
            "text-sm text-shadow-md sq:text-base story:text-lg",
            "leading-snug sq:leading-snug story:leading-snug", // force override `line-height` from text-X and required for `useFitText` hook
            "flex-shrink flex-grow", // shrink if necessary
            "overflow-hidden overflow-ellipsis", // Not working?
          ])} style={{
            // Use tailwind text-X class if "fit" is not required.
            fontSize: fontSize === "100%" ? undefined : fontSize
          }}>
            {description}
          </p>
        </header>

        <div className={
          clsx([
            "row-end-13 row-span-full col-end-13 col-span-full",
            "banner:col-span-3 banner:row-span-2 banner:col-end-13 banner:row-end-13",
            "sq:col-span-4 sq:row-span-2 sq:col-end-13 sq:row-end-13",
            "story:row-span-2 story:row-end-13"
          ])
        }>
          <img
            className={clsx([
              "w-full h-full",
              "object-contain banner:object-right-bottom",
              "opacity-80",
              // filter: brightness(0); creates a black mask
              // filter: brightness(0) invert(1); creates a white mask
              "filter brightness-0 invert-0 dark:invert",
            ])}
            src={logoOutline}
          />
        </div>
      </Layer>
    </div>
  );
}
