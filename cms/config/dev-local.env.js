'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development-local"',
  BASE_API: '"/api/"',
  UPLOAD_URL: '"/api/"'
})
