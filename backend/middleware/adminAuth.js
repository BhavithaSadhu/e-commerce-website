// middleware/adminAuth.js
import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // debug: show headers the server actually received for this request
    console.log("HEADERS RECEIVED:", req.headers);
    console.log("TOKEN HEADER AT SERVER:", req.headers.token);

    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "User Not Authorised" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASS) {
      return res.json({ succes: false, message: "User Not Authorised" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
