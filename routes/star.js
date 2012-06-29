// post to it to star/unstar a package.
// view it to show the clickable image.
module.exports = star


function star (req, res) {
  if (!req.params.package) return res.error(404)

  switch (req.method) {
    case 'HEAD': case 'GET': return show(req, res)
    case 'POST': return set(req, res)
    default: return res.error(405)
  }
}

function show (req, res) {
  req.params.nocache = true
  req.model.load('star', req.params)
  req.model.load('myprofile', req)
  req.model.end(function (er, m) {
    console.error('model', m)
    if (er) return res.error(er)
    form(req, res)
  })
}

function set (req, res) {
  req.model.load('star', req.params)
  req.model.load('package', req.params.package)
  req.model.load('myprofile', req)
  req.on('form', function (data) {
    req.form = data || true
  })
  req.model.end(function (er) {
    if (req.form) return then(req.form)
    req.on('form', then)
  })

  function then (data) {
    if (!data || !data.hasOwnProperty('star')) {
      return res.error(400)
    }

    if (!res.model.myprofile) return res.error(401)

    // set the thing in the background, and send the form
    var pkg = req.model.package
    , users = pkg.users || {}
    , starred = !!+req.form.star
    , name = req.model.myprofile.name

    console.error('starred', starred)
    console.error('users', users)
    console.error('form', req.form)

    if (!starred) {
      delete users[name]
    } else {
      users[name] = true
    }
    console.error('users after', users)

    pkg.users = users
    Object.keys(pkg).forEach(function (k) {
      if (k !== '_id' && k !== '_rev' && k.match(/^_/)) {
        delete pkg[k]
      }
    })
    var pu = '/registry/' + pkg._id

    // best effort is fine.  ignore errors.
    req.couch.put(pu, pkg, function (er, cr, data) {
      console.error(er, data)
    })

    return form(req, res)
  }
}

function form (req, res) {
  var who = req.model.star
  , name = req.model.myprofile.name
  , formStar = req.form && !!+req.form.star
  , starred = req.form ? formStar : who.indexOf(name) !== -1

  res.template('star.ejs',
               { who: who
               , rand: Math.random()
               , star: starred
               , package: req.params.package })

  // res.json([starred, req.model.myprofile, req.model.star, req.form])
}
