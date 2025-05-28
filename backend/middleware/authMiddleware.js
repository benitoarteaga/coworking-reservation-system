exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'No autenticado' });
  }
};

exports.hasRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'No autorizado' });
    }
  };
};
