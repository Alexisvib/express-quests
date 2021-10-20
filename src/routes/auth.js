const authRouter = require("express").Router();
const User = require("../models/user");
const { calculateToken } = require("../helpers/users");

authRouter.post("/checkCredentials", (req, res) => {
  const user = req.body;
  User.findByEmail(user.email).then((existingUser) => {
    if (existingUser) {
      User.verifyPassword(user.password, existingUser.hashedPassword)
        .then((passwordCorrect) => {
          if (passwordCorrect) {
            const token = calculateToken(existingUser.id, existingUser.email);
            res.cookie("user_token", token);
            res.send();
          } else {
            return res.status(401).send("Mot de passe incorrect");
          }
        })
        .catch((err) => res.status(500).send("error"));
    } else {
      return res.status(404).send("User not found");
    }
  });
});

module.exports = authRouter;
