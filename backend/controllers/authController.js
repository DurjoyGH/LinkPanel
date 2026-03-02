const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken, generateRefreshToken } = require("../services/jwt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token: token,
      refreshToken: refreshToken,
      role: user.role,
      redirectTo: user.role === "admin" ? "/admin/dashboard" : "/links",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Internal Server Error!" });
  }
};
