// star({package: package}, function (er, users) {})
// star({user: user}, function (er, packages) {})

module.exports = star

var package = require('./package.js')
var callresp = require('cluster-callresp')

function star (r, cb) {
  if (r.package) return package(r.package, function (er, p) {
    cb(er, Object.keys(p && p.users || {}))
  })
  if (r.user) return starredByUser(r.user, cb)
  return cb(new Error('bad star request'))
}

// /-/starred-by-user/isaacs
function starredByUser (user, cb) {
  callresp({ cmd: 'registry.get'
           , name: '/-/starred-by-user/isaacs'
           }, function (er, data) {
    return cb(er, data && data[user] || [])
  })
}
