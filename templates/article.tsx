import React from 'react';
import {TemplateProps} from '@flayyer/flayyer-types';
import {useGoogleFonts} from '@flayyer/use-googlefonts';
import {Variable as V, Validator, Static} from '@flayyer/variables';
import {proxy} from '@flayyer/proxy';
import clsx from 'clsx';
import useFitText from 'use-fit-text';
import {useSmartcrop} from 'use-smartcrop';

import '../styles/tailwind.css';
import logoOutline from '../static/logo.svg';
import img1 from '../static/img1.jpeg';
import img2 from '../static/img2.jpeg';

import {getPreferredModeFromPalette} from '../utils/color';
import {Layer} from '../components/layers';

export const schema = V.Object({
  title: V.String({default: 'Create images with React.js'}),
  description: V.String({
    default:
      'Take control over the content and add custom logic using queryparams as props 🚀'
  }),
  image: V.Image({
    description: 'Background image',
    default: img2,
    examples: [img1, img2]
  }),
  logo: V.Image({
    description: 'Transparent is recommended',
    default: logoOutline
  }),
  date: V.Date({
    description: 'Published date',
    default: new Date().toISOString().slice(0, 10) // Remove time and tz
  }),
  font: V.Optional(
    V.Font({default: 'Inter', examples: ['Montserrat', 'Arvo']})
  ),
  solid: V.Optional(
    V.Boolean({
      title: 'Solid logo',
      description: 'Enable for non-transparent logo',
      default: true
    })
  )
});
type Variables = Static<typeof schema>;
const validator = new Validator(schema);

// Make sure to 'export default' a React component
export default function ArticleTemplate({
  width = 1200,
  height = 630,
  locale = 'en',
  variables
}: TemplateProps<Variables>) {
  const {fontSize, ref} = useFitText({minFontSize: 20, maxFontSize: 100});

  const {
    data: {title, description, image, logo, solid, font, date: dateString}
  } = validator.parse(variables);

  const fonts = [font].filter(Boolean) as string[];
  const googleFont = useGoogleFonts(
    fonts.map((f) => ({
      family: f,
      styles: [400, 600]
    }))
  );

  const dateParsed = dateString && Date.parse(dateString); // In ms
  const formatter = new Intl.DateTimeFormat(locale, {dateStyle: 'long'} as any);

  const cropped = useSmartcrop(proxy(image), {width, height, minScale: 1});
  const palette = cropped.getPalette({height: height / 3});
  if (cropped.error) {
    console.error(cropped.error);
  }

  const scheme = getPreferredModeFromPalette(palette, 'dark');

  return (
    <div
      className={clsx([
        'relative w-full h-full antialiased overflow-hidden',
        {
          dark: scheme === 'dark',
          'flayyer-ready': googleFont.status && cropped.status
        }
      ])}
      style={{fontFamily: fonts.join(', ')}}
    >
      <Layer>
        <img
          src={cropped.src}
          className="w-full h-full bg-white dark:bg-black"
        />
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
              'text-lg text-shadow-md sq:text-2xl story:text-3xl font-semibold',
              'banner:leading-tight sq:leading-tight story:leading-tight', // Force override `line-height` from text-X
              'flex-shrink-0 flex-grow-0', // Prevent shirking
              'overflow-hidden overflow-ellipsis' // Not working?
            ])}
          >
            {title}
          </h1>

          <p
            ref={ref}
            className={clsx([
              'mt-2',
              'hidden sq:block',
              'text-sm text-shadow-md sq:text-base story:text-lg',
              'leading-snug sq:leading-snug story:leading-snug', // Force override `line-height` from text-X and required for `useFitText` hook
              'flex-shrink flex-grow', // Shrink if necessary
              'overflow-hidden overflow-ellipsis' // Not working?
            ])}
            style={{
              // Use tailwind text-X class if "fit" is not required.
              fontSize: fontSize === '100%' ? undefined : fontSize
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
