module.exports = packageList

var package = require('./package.js')
function packageList (/* pkgs..., cb */) {
  var pkgs = new Array(arguments.length - 1)
  for (var i = 0; i < arguments.length - 1; i ++) {
    pkgs[i] = arguments[i]
  }

  var cb = arguments[i]
  , errState = null
  , res = new Array(i)

  if (i === 0) return process.nextTick(function () {
    cb(null, res)
  })

  pkgs.forEach(function (p, index) {
    package(p, next(index))
  })

  function next (index) { return function (er, data) {
    if (errState) return
    if (er) return cb(errState = er)
    res[index] = data
    if (--i === 0) return cb(null, res)
  }}
}

