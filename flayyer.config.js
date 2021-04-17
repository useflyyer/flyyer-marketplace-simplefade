const {config} = require('@flayyer/flayyer-types');
require('dotenv').config();

module.exports = config({
  engine: 'react-typescript',
  key: process.env.FLAYYER_KEY,
  deck: 'simple-fade',

  // Optionals
  name: 'My Deck',
  description: 'Created with create-flayyer-app'
});
