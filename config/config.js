require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || 'password',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 5432,
  dbName: process.env.DB_NAME || 'db_mystore',
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretRecovery: process.env.JWT_SECRET_RECOVERY,
  userMail: process.env.USER_MAIL,
  userPass: process.env.USER_PASS,
};

module.exports = config;
