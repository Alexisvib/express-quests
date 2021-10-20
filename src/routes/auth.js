const authRouter = require("express").Router();
const User = require("../models/user");

authRouter.post("/checkCredentials", (req, res) => {
  const user = req.body
  User.findByEmail(user.email).then((existingUser) => {
    if (existingUser) {
      User.verifyPassword(user.password, existingUser.hashedPassword).then(
        (result) => {
          if (result) return res.status(200).send("Mot de passe correct");
          else return res.status(401).send("Mot de passe incorrect");
        }
      );
    } else {
      return res.status(404).send("User not found");
    }
  });
});

module.exports = authRouter;
