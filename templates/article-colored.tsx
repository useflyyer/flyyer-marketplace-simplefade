import React from 'react';
import {TemplateProps} from '@flyyer/types';
import {Validator, Static, Variable as V} from '@flyyer/variables';
import twColors from 'tailwindcss/colors';

import '../styles/tailwind.css';

import {BaseTemplate} from '../components/template';
import {logos, images, schema as schemaBase, logo, image} from '../schema';
import {BlendMode} from '../utils/blend-modes';

const colors: string[] = [
  twColors.purple[300],
  twColors.trueGray[400],
  twColors.blue[300],
  twColors.pink[300],
  twColors.indigo[300],
  twColors.gray[100],
  twColors.cyan[400],
  twColors.yellow[300],
  twColors.pink[300],
  twColors.green[300]
];

/**
 * Export to enable variables UI on Flyyer.io
 */
export const schema = V.Intersect([
  schemaBase,
  V.Object({
    logo: V.Image({
      title: logo.title,
      description: logo.description,
      default: logos.light,
      examples: [logos.light, logos.dark]
    }),
    image: V.Image({
      title: image.title,
      description: image.description,
      examples: [images[4], images[0], images[1], images[2], images[3]]
    })
  }),
  V.Object({
    color: V.ColorHex({
      description: 'Tint color',
      default: colors[0],
      examples: colors
    }),
    mode: V.Enum(BlendMode, {
      title: 'Blend mode',
      description: 'Same as CSS',
      default: BlendMode.multiply, // Best sane default
      examples: [
        BlendMode.multiply,
        BlendMode.color,
        BlendMode.hue,
        BlendMode.darken,
        BlendMode['hard-light'],
        BlendMode['soft-light']
      ]
    })
  })
]);

type Variables = Static<typeof schema>;
const validator = new Validator(schema);

// Make sure to 'export default' a React component
export default function ArticleTemplate({
  width = 1200,
  height = 630,
  locale = 'en',
  variables
}: TemplateProps<Variables>) {
  const {
    data: {color, mode, ...data}
  } = validator.parse(variables);

  return (
    <BaseTemplate
      {...(data as any)}
      width={width}
      height={height}
      locale={locale}
      scheme="dark"
    >
      <div
        className="inset-0 absolute w-full h-full"
        style={{
          backgroundColor: color || undefined,
          // @ts-expect-error Clean value
          mixBlendMode: mode
            ? mode.toLowerCase().trim().replace(/\s+/g, '-')
            : undefined
        }}
      />
    </BaseTemplate>
  );
}
