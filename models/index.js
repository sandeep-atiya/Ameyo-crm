import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import sequelize from '../config/db.js';
import defineUser from './User.js';
import defineUserType from './UserType.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Directly instantiate the models
const User = defineUser(sequelize, DataTypes);
const UserType = defineUserType(sequelize, DataTypes);

db.tblUser = User;
db.UserType = UserType;

// Set up associations after all models are loaded
User.belongsTo(UserType, { foreignKey: 'UserTypeID', as: 'userType' });
UserType.hasMany(User, { foreignKey: 'UserTypeID', as: 'users' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
