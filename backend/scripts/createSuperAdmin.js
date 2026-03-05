require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const connectDB = require("../configs/db");
const User = require("../models/user");

const SUPER_ADMIN = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  isVerified: true,
};

const createSuperAdmin = async () => {
  await connectDB();

  try {
    const existing = await User.findOne({ email: SUPER_ADMIN.email });

    if (existing) {
      console.log("⚠️  Super admin already exists:", existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, 10);

    const admin = await User.create({
      name: SUPER_ADMIN.name,
      email: SUPER_ADMIN.email,
      password: hashedPassword,
      role: SUPER_ADMIN.role,
      isVerified: SUPER_ADMIN.isVerified,
    });

    console.log("✅ Super admin created successfully!");
    console.log("   Name  :", admin.name);
    console.log("   Email :", admin.email);
    console.log("   Role  :", admin.role);
  } catch (error) {
    console.error("❌ Failed to create super admin:", error.message);
  } finally {
    process.exit(0);
  }
};

createSuperAdmin();
