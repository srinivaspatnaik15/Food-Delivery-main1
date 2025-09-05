import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers["authorization"]; // Header key is usually lowercase 'authorization'

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Remove "Bearer " prefix
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request for further use
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }
};

export default authMiddleware;
