function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function isPengurus(req, res, next) {
  if (req.session.user && req.session.user.role === "pengurus") {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = { isAuthenticated, isPengurus };
