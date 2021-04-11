import chroma from "chroma-js";

export function getHighestContrast(color: string | undefined | null, colors: string[]): [string, number] {
  if (!colors || colors.length === 0) {
    throw new TypeError("Argument 'colors' must be a non-empty array of strings.");
  }
  if (!color) {
    return [colors[0], 0];
  }
  const tuples = colors.map(c => [c, chroma.contrast(color, c)] as [string, number]);
  const ordered = tuples.sort((t1, t2) => t2[1] - t1[1]); // sort desc
  return ordered[0];
}

export function getPreferredContrast(color: string | undefined | null, colors: string[]): [string, number] {
  if (!colors || colors.length === 0) {
    throw new TypeError("Argument 'colors' must be a non-empty array of strings.");
  }
  if (!color) {
    return [colors[0], 0];
  }
  const threshold = 4.5; // https://vis4.net/chromajs/#chroma-contrast
  const tuples = colors.map(c => [c, chroma.contrast(color, c)] as [string, number]);
  const first = tuples.find(([, contrast]) => contrast >= threshold);
  if (first) {
    return first;
  } else {
    const ordered = tuples.sort((t1, t2) => t2[1] - t1[1]); // sort desc
    return ordered[0];
  }
}

export function getPreferredModeFromPalette(palette: string[] | number[][], defaultMode: "light" | "dark" = "light"): "light" | "dark" {
  if (!palette || palette.length === 0) {
    return defaultMode;
  }
  const main = chroma(palette[0] as any);
  const lightContrast = chroma.contrast(main, "white");
  const darkContrast = chroma.contrast(main, "black");
  console.log({lightContrast, darkContrast});

  if (lightContrast > darkContrast) {
    return "dark";
  } else if (lightContrast < darkContrast) {
    return "light";
  } else {
    return defaultMode;
  }
}
