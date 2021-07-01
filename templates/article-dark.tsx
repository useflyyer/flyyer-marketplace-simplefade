import React from 'react';
import {TemplateProps} from '@flayyer/flayyer-types';
import {Validator, Static, Variable as V} from '@flayyer/variables';

import '../styles/tailwind.css';

import {BaseTemplate} from '../components/template';
import {logos, images, schema as schemaBase, logo, image} from '../schema';

/**
 * Export to enable variables UI on Flayyer.com
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
      examples: [images[2], images[0], images[1], images[3], images[4]]
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
      scheme="dark"
    />
  );
}
