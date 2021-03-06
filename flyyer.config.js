const {config, Sizes} = require('@flyyer/types');
const dedent = require('dedent');
require('dotenv').config();

module.exports = config({
  engine: 'react-typescript',
  key: process.env.FLYYER_KEY,
  deck: 'simple-fade',

  // Optionals
  name: 'Simple Fade',
  description: dedent`
    Ideal for news or blogposts with a featured image.

    Automatically centers the image base on the point of interest and has 3 possible color schemes: dark, light and colored (you can customize the tint color).

    > Credits to [Photo by Lhairton Kelvin Costa from Pexels](https://www.pexels.com/photo/woman-in-red-and-black-polka-dot-long-sleeve-shirt-and-white-shorts-4617115/)
    > Credits to [Photo by Monica Turlui from Pexels](https://www.pexels.com/photo/smiling-woman-leaning-on-hand-on-unmade-bed-at-home-7218407/)
    > Credits to [Photo by Aleksandar Pasaric from Pexels](https://www.pexels.com/photo/photo-of-buildings-during-nighttime-2603464/)
    > Credits to [Photo by Calbert Warner from Pexels](https://www.pexels.com/photo/woman-above-man-2889943/)
    > Credits to [Photo by Pixabay from Pexels](https://www.pexels.com/photo/man-in-black-tops-wearing-black-headphones-singing-in-front-of-black-condenser-microphone-210913/)
  `,
  homepage: 'https://flyyer.io',
  keywords: ['flyyer', 'free', 'fade', 'contrast', 'mix-blend-mode'],
  license: 'MIT',
  private: false,
  repository: 'https://github.com/useflyyer/flyyer-marketplace-simplefade',
  sizes: ['THUMBNAIL', 'BANNER', 'SQUARE', 'STORY']
});
