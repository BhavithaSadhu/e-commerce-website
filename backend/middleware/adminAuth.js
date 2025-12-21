import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ROLE-BASED CHECK (RECOMMENDED)
    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Admin access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default adminAuth;
