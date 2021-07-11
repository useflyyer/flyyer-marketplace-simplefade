import React from 'react';
import {TemplateProps} from '@flyyer/types';
import {Validator, Static, Variable as V} from '@flyyer/variables';

import '../styles/tailwind.css';

import {BaseTemplate} from '../components/template';
import {logos, images, schema as schemaBase, logo, image} from '../schema';

/**
 * Export to enable variables UI on Flyyer.io
 */
export const schema = V.Intersect([
  schemaBase,
  V.Object({
    logo: V.Image({
      title: logo.title,
      description: logo.description,
      default: logos.dark,
      examples: [logos.dark, logos.light]
    }),
    image: V.Image({
      title: image.title,
      description: image.description,
      // default: images[1],
      examples: [images[1], images[0], images[2], images[3], images[4]]
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
  const {data} = validator.parse(variables);

  return (
    <BaseTemplate
      {...(data as any)}
      width={width}
      height={height}
      locale={locale}
      scheme="light"
    />
  );
}
