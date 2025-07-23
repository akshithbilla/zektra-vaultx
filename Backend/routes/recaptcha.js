// backend/routes/recaptcha.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

const SECRET_KEY = "6LdzZ3crAAAAAK8grOh4DpMHOuyfsDyAY-OvXglb"; // 🔒 from Google dashboard

router.post("/verify-captcha", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "No token provided" });
  }

  try {
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`;
    const response = await axios.post(verificationURL);

    if (response.data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: "reCAPTCHA failed" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: "Verification error" });
  }
});

export default router;
