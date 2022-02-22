'use strict'
const utils = require('./utils')
const config = require('../config')
const isBookion = process.env.NODE_ENV === 'bookion'
const sourceMapEnabled = isBookion
  ? config.build.bookionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isBookion
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
