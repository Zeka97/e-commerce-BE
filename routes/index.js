import express from "express";
const router = express.Router();
import { AuthentificateQueries } from "../queries.js";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
export default router;
