module.exports = search

function search (req, res) {
  req.model.load('profile', req)
  req.model.load('search', req.query.q)
  req.model.end(function (er, m) {
    if (er) return res.error(er)
    var locals = {
      results: m.search,
      profile: m.profile
    };
    return res.template('search.ejs', {})
  })
}
