module.exports = search

var LRU = require('lru-cache')
, regData = new LRU(100)
, npm = require('npm')

function search (query, cb) {
  if (typeof query !== 'string')
