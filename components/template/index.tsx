import React from 'react';
import {TemplateProps} from '@flayyer/flayyer-types';
import {useGoogleFonts} from '@flayyer/use-googlefonts';
import {proxy} from '@flayyer/proxy';
import {Static} from '@flayyer/variables';
import {useFitText} from '@flayyer/use-fit-text';
import {useSmartcrop} from 'use-smartcrop';
import clsx from 'clsx';

import {getPreferredModeFromPalette} from '../../utils/color';
import {Layer} from '../layers';
import {schema} from '../../schema';

export type Variables = Static<typeof schema>;

export type BaseTemplateProps = React.ComponentProps<'div'> &
  Pick<TemplateProps, 'width' | 'height' | 'locale'> &
  Variables & {
    scheme: 'light' | 'dark' | 'auto';
  };

export function BaseTemplate({
  font,
  fontSecondary,
  date,
  image,
  title,
  description,
  logo,
  solid,
  // Flayyer context props
  width,
  height,
  locale,
  // Custom props
  scheme,
  // Component props
  className,
  ...props
}: BaseTemplateProps) {
  const fonts = [font, fontSecondary].filter(Boolean) as string[];
  const googleFont = useGoogleFonts(
    fonts.map((f) => ({
      family: f,
      styles: [400, 600, 800]
    }))
  );

  const dateParsed = date && Date.parse(date); // In ms
  const formatter = new Intl.DateTimeFormat(locale, {dateStyle: 'long'} as any);

  const cropped = useSmartcrop(proxy(image), {width, height, minScale: 1});
  const palette = cropped.getPalette({height: height / 3});
  if (cropped.error) {
    console.error(cropped.error);
  }

  const schemeAuto = getPreferredModeFromPalette(palette, 'dark');

  let dark = false;
  if (scheme === 'auto') {
    dark = schemeAuto === 'dark';
  } else if (scheme === 'dark') {
    dark = true;
  }

  const {fontSize, ref} = useFitText({minFontSize: 20, maxFontSize: 100}, [
    // Font-size's dependencies
    dateParsed,
    font,
    title,
    fontSecondary,
    description
  ]);

  return (
    <div
      className={clsx([
        'relative w-full h-full antialiased overflow-hidden',
        className,
        {dark, 'flayyer-ready': googleFont.status && cropped.status}
      ])}
      {...props}
    >
      <Layer className="bg-white dark:bg-black">
        <img src={cropped.src} className="w-full h-full" />
      </Layer>
      <Layer className="bg-gradient-to-b from-white dark:from-black bottom-3/4 story:bottom-1/2 opacity-0 banner:opacity-50" />
      <Layer className="bg-gradient-to-t from-white dark:from-black top-3/4 opacity-0 banner:opacity-30" />

      <Layer
        className={clsx([
          'grid grid-cols-12 grid-rows-12 auto-rows-fr auto-cols-fr',
          'p-2 banner:p-3 sq:p-4 story:py-storysafe' // Use Instagram safe-zone
        ])}
      >
        <header
          ref={ref}
          style={{fontSize, fontFamily: font || undefined}}
          className={clsx([
            'hidden banner:flex flex-col',
            'col-span-full row-span-4 sq:row-span-8',
            'text-gray-900 dark:text-white'
          ])}
        >
          {dateParsed && Number.isFinite(dateParsed) && (
            <time className="block text-gray-800 dark:text-gray-100 opacity-90 text-xs tracking-tight">
              {formatter.format(dateParsed)}
            </time>
          )}

          <h1
            className={clsx([
              'text-xl text-shadow-md sq:text-2xl story:text-3xl font-semibold',
              'banner:leading-tight sq:leading-tight story:leading-tight',
              'flex-shrink-0 flex-grow-0'
            ])}
          >
            {title}
          </h1>

          <p
            ref={ref}
            className={clsx([
              'mt-2',
              'hidden sq:block',
              'text-shadow-md',
              'text-base story:text-lg',
              'leading-snug story:leading-snug',
              'flex-shrink flex-grow'
            ])}
            style={{
              fontFamily: fontSecondary || undefined
            }}
          >
            {description}
          </p>
        </header>

        {logo && (
          <div
            className={clsx([
              'row-end-13 row-span-full col-end-13 col-span-full',
              'banner:col-span-3 banner:row-span-2 banner:col-end-13 banner:row-end-13',
              'sq:col-span-4 sq:row-span-2 sq:col-end-13 sq:row-end-13',
              'story:row-span-2 story:row-end-13',
              'flex'
            ])}
          >
            <img
              className={clsx([
                'flex-1',
                'object-contain object-center banner:object-right-bottom',
                // Filter: brightness(0); creates a black mask
                // filter: brightness(0) invert(1); creates a white mask
                !solid && 'opacity-80 filter brightness-0 invert-0 dark:invert'
              ])}
              src={proxy(logo)}
            />
          </div>
        )}
      </Layer>
    </div>
  );
}
