import chroma from 'chroma-js';

export function getHighestContrast(
  color: string | undefined | null,
  colors: string[]
): [string, number] {
  if (!colors || colors.length === 0) {
    throw new TypeError(
      "Argument 'colors' must be a non-empty array of strings."
    );
  }

  if (!color) {
    return [colors[0], 0];
  }

  const tuples = colors.map(
    (c) => [c, chroma.contrast(color, c)] as [string, number]
  );
  const ordered = tuples.sort((t1, t2) => t2[1] - t1[1]); // Sort desc
  return ordered[0];
}

export function getPreferredContrast(
  color: string | undefined | null,
  colors: string[]
): [string, number] {
  if (!colors || colors.length === 0) {
    throw new TypeError(
      "Argument 'colors' must be a non-empty array of strings."
    );
  }

  if (!color) {
    return [colors[0], 0];
  }

  const threshold = 4.5; // https://vis4.net/chromajs/#chroma-contrast
  const tuples = colors.map(
    (c) => [c, chroma.contrast(color, c)] as [string, number]
  );
  const first = tuples.find(([, contrast]) => contrast >= threshold);
  if (first) {
    return first;
  }

  const ordered = tuples.sort((t1, t2) => t2[1] - t1[1]); // Sort desc
  return ordered[0];
}

const white = chroma('white');
  const black = chroma('black');
export function getPreferredModeFromPalette(
  palette: string[] | number[][],
  defaultMode: 'light' | 'dark' = 'light'
): 'light' | 'dark' {
  if (!palette || palette.length === 0) {
    return defaultMode;
  }
  const lightContrasts: number[] = [];
  const darkContrasts: number[] = [];
  for (const color of palette) {
    const c = chroma(color as any);
    lightContrasts.push(chroma.contrast(c, white));
    darkContrasts.push(chroma.contrast(c, black));
  }

  const lightContrast = avg(lightContrasts);
  const darkContrast = avg(darkContrasts);

  // Console.table({
  //   palette: palette.join("-"),
  //   lightContrasts: lightContrasts.join(" - "),
  //   darkContrasts: darkContrasts.join(" - "),
  //   white: chroma("white").hex(),
  //   black: chroma("black").hex(),
  //   lightContrast,
  //   darkContrast,
  // });

  if (lightContrast > darkContrast) {
    return 'dark';
  } else if (lightContrast < darkContrast) {
    return 'light';
  } else {
    return defaultMode;
  }
}

function avg(numbers: number[]) {
  return numbers.reduce((a, b) => a + b) / numbers.length;
}
