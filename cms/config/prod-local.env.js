'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production-local"',
  BASE_API: '"/cms/mock/"',
  UPLOAD_URL: '"/cms/mock/"'
})
