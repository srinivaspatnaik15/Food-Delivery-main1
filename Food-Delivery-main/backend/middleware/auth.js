import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"]; // lowercase in Express
  if (!authHeader) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const token = authHeader.split(" ")[1]; // remove "Bearer"
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;

