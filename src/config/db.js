/**
 * Database Configuration
 * Sequelize configuration for MSSQL database
 */

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

/**
 * Database configuration by environment
 */
const dbConfig = {
  development: {
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'DristhiSoftTechDBOld',
    host: process.env.DB_HOST || '192.168.10.76',
    port: process.env.DB_PORT || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'DristhiSoftTechDBOld',
    host: process.env.DB_HOST || '192.168.10.76',
    port: process.env.DB_PORT || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false,
  },
  production: {
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'DristhiSoftTechDBOld',
    host: process.env.DB_HOST || '192.168.10.76',
    port: process.env.DB_PORT || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    },
    logging: false,
  },
};

const config = dbConfig[env];

/**
 * Initialize Sequelize connection
 */
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,
  logging: config.logging,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
