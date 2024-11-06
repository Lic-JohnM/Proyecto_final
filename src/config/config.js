// config/config.js
require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/defaultDB",
  port: process.env.PORT || 8080,
};
