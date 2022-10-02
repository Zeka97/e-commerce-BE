var express = require("express");
var router = express.Router();
const { kategorijeQueries, artikliQueries } = require("../queries");

router.get("/", kategorijeQueries.getAllCategories, (req, res, next) => {
  res.status(200).json(req.kategorije);
});

router.get("/:id", artikliQueries.getOneCategoryArticles, (req, res, next) => {
  res.status(200).json(req.artikli);
});

module.exports = router;
