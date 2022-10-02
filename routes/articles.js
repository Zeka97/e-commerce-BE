var express = require("express");
var router = express.Router();

const { artikliQueries } = require("../queries");

router.get("/", artikliQueries.getAllArticles, (req, res, next) => {
  res.status(200).json(req.artikli);
});

router.get("/:id", artikliQueries.getOneArticle, (req, res, next) => {
  res.status(200).json(req.artikal);
});

module.exports = router;
