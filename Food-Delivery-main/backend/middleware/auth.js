import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers["authorization"];   // ✅ must be "authorization"

    if (!token) {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];   // ✅ remove "Bearer "
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;   // ✅ attach userId
    next();
  } catch (error) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }
};

export default authMiddleware;
