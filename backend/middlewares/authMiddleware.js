const { verifyToken } = require("../services/jwt");
const User = require("../models/user");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access token required!" });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Account not verified!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required!",
      requiredRole: "admin",
      userRole: req.user.role,
    });
  }
  next();
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: "Account verification required!" });
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions!",
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }
    next();
  };
};

const requireOwnershipOrAdmin = (userIdField = "userId") => {
  return (req, res, next) => {
    const resourceUserId = req.params[userIdField] || req.body[userIdField];

    if (
      req.user.role === "admin" ||
      req.user._id.toString() === resourceUserId
    ) {
      next();
    } else {
      return res.status(403).json({
        message:
          "You can only access your own resources or need admin privileges!",
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  isAdmin: requireAdmin,
  requireVerified,
  requireRole,
  requireOwnershipOrAdmin,
};
