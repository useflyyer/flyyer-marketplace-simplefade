import React from 'react';
import {TemplateProps} from '@flayyer/flayyer-types';
import {useGoogleFonts} from '@flayyer/use-googlefonts';
import {proxy} from '@flayyer/proxy';
import clsx from 'clsx';
import useFitText from 'use-fit-text';
import {useSmartcrop} from 'use-smartcrop';

import '../styles/tailwind.css';
import logoOutline from '../static/logo.svg';

import {getPreferredModeFromPalette} from '../utils/color';

// Make sure to 'export default' a React component
export default function ArticleTemplate({
  width = 1200,
  height = 630,
  locale = 'en',
  variables
}: TemplateProps) {
  const {
    title = 'Create images with React.js',
    description = 'Take control over the content and add custom logic using queryparams as props 🚀',
    date = new Date().toISOString(),
    image = 'https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    fonts = ['Inter'],
    logo = logoOutline,
    solid = false
  } = variables;
  const {fontSize, ref} = useFitText({minFontSize: 20, maxFontSize: 100});
  const fontsParsed: string[] = (Array.isArray(fonts) ? fonts : [fonts]).filter(
    Boolean
  );
  const font = useGoogleFonts(
    fontsParsed.map((f) => ({
      family: f,
      styles: [400, 600]
    }))
  );

  const dateParsed = Date.parse(date); // In ms
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
          'flayyer-ready': font.status && cropped.status
        }
      ])}
      style={{fontFamily: fontsParsed.join(', ')}}
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
          {Number.isFinite(dateParsed) && (
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

function Layer({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx('absolute inset-0 w-full h-full', className)}
    />
  );
}
