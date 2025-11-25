import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../config/db.js';
import defineUser from '../models/User.js';

const User = defineUser(sequelize);

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Helper to remove sensitive fields from user object
const sanitizeUser = (userInstance) => {
  if (!userInstance) return null;
  const user = userInstance.toJSON ? userInstance.toJSON() : userInstance;
  delete user.upassword;
  return user;
};

export const register = async (req, res) => {
  try {
    const { uname, password, ProPicture } = req.body;

    // Check for existing username
    const existing = await User.findOne({ where: { uname } });
    if (existing) return res.status(400).json({ success: false, message: 'Username already exists' });

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // If DB upassword column is smaller than hash length, inform user to alter column
    if (hashed.length > 50) {
      // DB currently has varchar(50) for upassword per provided schema.
      return res.status(500).json({
        success: false,
        message: 'Database password column too small for secure hashed passwords. Please ALTER TABLE tblUser ALTER COLUMN upassword VARCHAR(255);'
      });
    }

    const created = await User.create({ uname, upassword: hashed, ProPicture });

    return res.status(201).json({ success: true, message: 'User registered', data: sanitizeUser(created) });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { uname, password } = req.body;
    const user = await User.findOne({ where: { uname } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.upassword || '');
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Update last login fields if present
    try { await user.update({ PasswordUpdate: new Date() }); } catch (e) { /* ignore */ }

    const token = jwt.sign({ uID: user.uID, uname: user.uname }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return res.json({ success: true, message: 'Login successful', data: { token, user: sanitizeUser(user) } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.uID;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    console.error('Get profile error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.uID;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const allowed = {};
    if (req.body.uname) allowed.uname = req.body.uname;
    if (req.body.ProPicture) allowed.ProPicture = req.body.ProPicture;

    await user.update(allowed);

    return res.json({ success: true, message: 'Profile updated', data: sanitizeUser(user) });
  } catch (err) {
    console.error('Update profile error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { register, login, getProfile, updateProfile };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, UserType } = require("../models");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { uname, password, userTypeID } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ where: { uname } });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      uname,
      upassword: hashedPassword,
      UserTypeID: userTypeID,
      StatusID: 1, // active
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { uname, password } = req.body;

    // find user with role
    const user = await User.findOne({
      where: { uname },
      include: { model: UserType, as: "userType", attributes: ["UserTypeText"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.upassword);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // generate JWT token
    const token = jwt.sign(
      { userId: user.uID, uname: user.uname, role: user.userType.UserTypeText },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
