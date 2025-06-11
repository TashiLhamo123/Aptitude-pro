function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.is_admin) {
    return next();
  } else {
    res.status(403).send('Access denied. Admins only.');
  }
}






module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  };
