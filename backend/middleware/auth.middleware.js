const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

// Middleware to verify token and check role permissions
function auth(requiredPermissions = []) {
  return async function (req, res, next) {
    const token = req.cookies.authToken || req.cookies.userAuthToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;

      // Fetch user details from database to verify roles and permissions
      const user = await User.findOne({
        where: { id: decoded.userId },
        include: [
          {
            model: Role,
            include: [{
              model: Permission
            }]
          }
        ]
      });

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      // Flatten permissions from roles
      const permissions = user.Roles.flatMap(role => role.Permissions.map(permission => permission.name));

      // If user is a normal user and no specific permissions are required
      if (!user.is_admin && requiredPermissions.length === 0 && user.status == 1) {
        return next(); // Proceed to the next middleware or route handler
      }

      // If user is an admin, check permissions
      if (user.is_admin && user.status == 1) {
        const hasPermission = requiredPermissions.every(perm => permissions.includes(perm));
        if (!hasPermission) {
          return res.status(403).send({ message: 'Insufficient permissions' });
        }
        return next(); // User is an admin and has required permissions
      }

      // If the user is neither an admin nor permissions are not met
      return res.status(403).send({ message: 'Access denied' });
    } catch (error) {
      return res.status(401).send({ message: 'Invalid token', error: error.message });
    }
  };
}

module.exports = {
  auth:auth
};
