import * as authService from '../services/authService.js';
import logger from '../utils/logger.js';

const sanitizeUser = (userInstance) => {
  if (!userInstance) return null;
  const user = userInstance.toJSON ? userInstance.toJSON() : userInstance;
  delete user.upassword;
  return user;
};

export const register = async (req, res) => {
  try {
    const { uname, password, ProPicture, UserTypeID } = req.body;
    const { user } = await authService.registerUser({ uname, password, ProPicture, UserTypeID });
    return res
      .status(201)
      .json({ success: true, message: 'User registered', data: sanitizeUser(user) });
  } catch (err) {
    logger.error('Register controller error', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { uname, password } = req.body;
    const { token, user } = await authService.loginUser(uname, password);
    return res.json({
      success: true,
      message: 'Login successful',
      data: { token, user: sanitizeUser(user) },
    });
  } catch (err) {
    logger.error('Login controller error', err.message);
    return res.status(401).json({ success: false, message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.uID;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await authService.getUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    logger.error('Get profile controller error', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.uID;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updated = await authService.updateUserProfile(userId, req.body);
    return res.json({ success: true, message: 'Profile updated', data: sanitizeUser(updated) });
  } catch (err) {
    logger.error('Update profile controller error', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export default { register, login, getProfile, updateProfile };
