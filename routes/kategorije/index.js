import express from "express";
const router = express.Router();
import * as controller from "./controller.js";

router.get("/", controller.getAllCategories);

export default router;
