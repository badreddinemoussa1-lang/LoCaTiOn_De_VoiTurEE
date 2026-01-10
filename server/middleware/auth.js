import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "not authorized" });
    }

    // ✅ support "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ✅ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ if token payload is { id: userId }
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "not authorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "not authorized" });
  }
};
