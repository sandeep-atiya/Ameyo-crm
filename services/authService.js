import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import logger from '../utils/logger.js';

const User = db.tblUser;
const UserType = db.UserType;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export const registerUser = async ({ uname, password, ProPicture, UserTypeID }) => {
  try {
    if (!uname || !password) throw new Error('Username and password are required');

    const existing = await User.findOne({ where: { uname } });
    if (existing) throw new Error('Username already exists');

    // NOTE: Password hashing is intentionally disabled per request —
    // storing plain-text password in `upassword`. This is insecure and
    // should only be used for testing or legacy compatibility.
    const created = await User.create({ uname, upassword: password, ProPicture, UserTypeID });

    logger.info(`User registered: ${uname}`);

    return { user: created };
  } catch (err) {
    logger.error('registerUser error', err.message);
    throw err;
  }
};

export const loginUser = async (uname, password) => {
  try {
    const user = await User.findOne({
      where: { uname },
      include: [{ model: UserType, as: 'userType' }],
    });
    if (!user) throw new Error('Invalid credentials');

    // Plain-text password comparison (insecure) per request
    const isValid = password === (user.upassword || '');
    if (!isValid) throw new Error('Invalid credentials');

    // Update password update / last login timestamp (non-blocking)
    try {
      await user.update({ PasswordUpdate: new Date() });
    } catch (e) {
      /* ignore */
    }

    const roleText = user.userType?.UserTypeText || 'user';

    const token = jwt.sign({ uID: user.uID, uname: user.uname, role: roleText }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    return { token, user };
  } catch (err) {
    logger.error('loginUser error', err.message);
    throw err;
  }
};

export const getUserById = async (uID) => {
  const user = await User.findByPk(uID, { include: [{ model: UserType, as: 'userType' }] });
  return user;
};

export const updateUserProfile = async (uID, data) => {
  const user = await User.findByPk(uID);
  if (!user) throw new Error('User not found');
  const allowed = {};
  if (data.uname) allowed.uname = data.uname;
  if (data.ProPicture) allowed.ProPicture = data.ProPicture;
  if (data.UserTypeID) allowed.UserTypeID = data.UserTypeID;
  const updated = await user.update(allowed);
  return updated;
};
