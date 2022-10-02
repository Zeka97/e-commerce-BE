var express = require("express");
var router = express.Router();
const {
  userQueries,
  AuthentificateQueries,
  narudzbeQueries,
} = require("../queries");
/* GET users listing. */
router.get("/", userQueries.getAllUsers, (req, res, next) => {
  res.status(200).json(req.users);
});

router.get(
  "/listanarudzbi",
  narudzbeQueries.getNarudzbe,
  narudzbeQueries.getArtikliNarudzbe,
  (req, res, next) => {
    return res.json(req.narudzbe);
  }
);
router.post(
  "/kreirajnarudzbu",
  narudzbeQueries.kreirajNarudzbu,
  narudzbeQueries.dodajArtikleUNarudzbu,
  (req, res, next) => {
    res.sendStatus(200);
  }
);

router.get("/:id", userQueries.getOneUser, (req, res, next) => {
  res.json(req.user);
});
router.delete("/:id", userQueries.deleteUser, (req, res, next) => {
  res.sendStatus(200);
});

router.put("/:id", userQueries.updateUser, (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;
