var express = require("express");
var router = express.Router();
const { AuthentificateQueries } = require("../queries");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post(
  "/login",
  AuthentificateQueries.userLogin,
  AuthentificateQueries.adminLogin,
  (req, res, next) => {
    if (req.user) res.json({ user: req.user });
    else if (req.admin) res.json({ admin: req.admin });
    else res.json({ message: "User ne postoji" });
  }
);

router.post(
  "/register",
  AuthentificateQueries.checkUsernameAndEmail,
  AuthentificateQueries.registrujUsera,
  (req, res, next) => {
    res.sendStatus(200);
  }
);

module.exports = router;
