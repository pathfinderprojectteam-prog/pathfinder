const allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`[RBAC] Validating Role: User is '${req.user?.role}'. Allowed: [${roles.join(', ')}]`);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to access this resource',
      });
    }
    next();
  };
};

module.exports = { allowRoles };
