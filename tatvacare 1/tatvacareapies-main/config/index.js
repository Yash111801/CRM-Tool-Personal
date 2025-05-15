const dotenv = require("dotenv");
dotenv.config();
const isDev = process.env.NODE_ENV === 'development';
module.exports = {
  URL: isDev
  ? process.env.DB_URL
  : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
  SALT_ROUND: process.env.SALT_ROUND
};
