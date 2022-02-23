'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_API: '"http://124.223.59.118:8999"'
    BASE_API: '"http://192.168.0.103:8080"'
})