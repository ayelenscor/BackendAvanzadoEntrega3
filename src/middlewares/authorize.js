export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ status: 'error', message: 'No autorizado' });

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado' });
    }

    next();
  };
}
