const jwt = require("jsonwebtoken");
require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const calculateToken = (userID, userEmail = "") => {
  return jwt.sign({ email: userEmail, user_id: userID }, PRIVATE_KEY);
};

module.exports = { calculateToken };
