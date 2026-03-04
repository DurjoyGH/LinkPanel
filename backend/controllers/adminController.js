const bcrypt = require("bcryptjs");
const User = require("../models/user");
const sendEmail = require("../services/email");
const { newUserEmail } = require("../utils/emailContents");

// POST /api/admin/add-user
const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: true,
    });

    const emailContent = newUserEmail({ name, email, password });
    await sendEmail({ to: email, ...emailContent });

    return res.status(201).json({
      message: "User created successfully. Login credentials sent to their email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("addUser error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { addUser };
