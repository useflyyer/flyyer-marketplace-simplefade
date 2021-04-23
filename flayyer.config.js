const {config, Sizes} = require('@flayyer/flayyer-types');
const dedent = require("dedent")
require('dotenv').config();

module.exports = config({
  engine: 'react-typescript',
  key: process.env.FLAYYER_KEY,
  deck: 'simple-fade',

  // Optionals
  name: 'Simple Fade',
  description: dedent`
    Ideal for news or blogpost with a featured image.
    Automatically centers the image base on the point of interest and uses the best white/dark scheme depending on the contract with the featured image.
  `,
  marketplace: true,
  homepage: "https://flayyer.com",
  keywords: ["flayyer", "free", "fade", "contrast"],
  license: "MIT",
  private: false,
  repository: "https://github.com/flayyer/flayyer-marketplace-simplefade",
  sizes: ["THUMBNAIL", "BANNER", "SQUARE", "STORY", "FREE"],
});
