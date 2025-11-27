/**
 * Models Index
 * Central export point for all Sequelize models
 */

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import defineUser from './user.model.js';
import defineUserType from './user-type.model.js';

const db = {};

// Instantiate models
const User = defineUser(sequelize, DataTypes);
const UserType = defineUserType(sequelize, DataTypes);

db.tblUser = User;
db.UserType = UserType;

// Set up associations
User.belongsTo(UserType, { foreignKey: 'UserTypeID', as: 'userType' });
UserType.hasMany(User, { foreignKey: 'UserTypeID', as: 'users' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
