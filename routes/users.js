import express from "express";
const router = express.Router();
import { userQueries, narudzbeQueries } from "../queries.js";
/* GET users listing. */
router.get("/", userQueries.getAllUsers, (req, res, next) => {
  res.status(200).json(req.users);
});


router.get("/:id", userQueries.getOneUser, (req, res, next) => {
  res.json(req.user);
});
router.delete("/:id", userQueries.deleteUser, (req, res, next) => {
  res.sendStatus(200);
});

router.put("/:id", userQueries.updateUser, (req, res, next) => {
  res.sendStatus(200);
});

export default router;
