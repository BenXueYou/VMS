'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  LOCAL_ENUMS: '"static/config/common_chinese.json"',
  MAP_STYLE: '"static/config/custom_map_config.json"',
  AREA_MAP_BORDER: '"static/config/area_map.json"',
})
