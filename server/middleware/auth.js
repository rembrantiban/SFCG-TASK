import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) token = parts[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
