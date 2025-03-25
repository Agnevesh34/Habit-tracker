const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extracts the actual token

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the decoded user data to the request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired. Please log in again." });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};
