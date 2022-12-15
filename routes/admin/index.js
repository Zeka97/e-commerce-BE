import express from "express";

import * as controller from "./controller.js";

const router = express.Router();

router.get("/getAllTransactions", controller.getAllTransactions);
router.post("/changeArticleVisibility", controller.changeArticleVisibility);
router.post("/setArticleOutOfStock", controller.setArticleOutOfStock);
export default router;
