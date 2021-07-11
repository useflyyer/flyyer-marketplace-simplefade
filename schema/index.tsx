import {Variable as V} from '@flyyer/variables';

import logoDark from '../static/logo-dark.svg';
import logoLight from '../static/logo-light.svg';
import image0 from '../static/image0.jpeg';
import image1 from '../static/image1.jpeg';
import image2 from '../static/image2.jpeg';
import image3 from '../static/image3.jpeg';
import image4 from '../static/image4.jpeg';

export const logos = {
  dark: logoDark,
  light: logoLight
};
export const images = [image0, image1, image2, image3, image4];

export const logo = V.Image({
  description: 'Transparent is recommended',
  default: logos.dark,
  examples: [logos.dark, logos.light]
});

export const image = V.Image({
  description: 'Background image',
  default: images[0],
  examples: images
});

export const schema = V.Object({
  title: V.String({
    // default: 'Almost before we knew it, we had left the ground.',
    examples: ['Almost before we knew it, we had left the ground.']
  }),
  description: V.String({
    // default: 'She stared through the window at the stars. 🚀',
    examples: ['She stared through the window at the stars. 🚀']
  }),
  image,
  logo,
  date: V.Optional(
    V.DateTime({
      description: 'Published date',
      // default: new Date().toISOString(),
      examples: [new Date().toISOString()]
    })
  ),
  font: V.Optional(
    V.Font({default: 'Inter', examples: ['Inter', 'Montserrat', 'Arvo']})
  ),
  fontSecondary: V.Optional(
    V.Font({default: 'Inter', examples: ['Inter', 'Montserrat', 'Arvo']})
  ),
  solid: V.Optional(
    V.Boolean({
      title: 'Solid logo',
      description: 'Enable for non-transparent logo',
      default: true
    })
  ),
  fade: V.Optional(
    V.Number({
      default: 0.2,
      minimum: 0,
      maximum: 1,
      description: 'Control intensity'
    })
  )
});
