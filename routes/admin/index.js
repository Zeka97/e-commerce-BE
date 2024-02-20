import express from "express";

import * as controller from "./controller.js";

const router = express.Router();

router.get("/getAllTransactions", controller.getAllTransactions);
router.post("/changeArticleVisibility", controller.changeArticleVisibility);
router.post("/setArticleOutOfStock", controller.setArticleOutOfStock);
router.post(
  "/updateArticleDiscountPrice",
  controller.updateArticleDiscountPrice
);
router.post(
  "/removeArticleDiscountPrice",
  controller.removeArticleDiscountPrice
);
router.post("/editArticle", controller.editArticle);
router.post("/addNewCategory", controller.addNewCategory);
router.post("/updateCategory", controller.updateCategory);
router.get("/getAllUsers", controller.getAllUsers);
router.get("/getUserDetails/:id", controller.getUserDetails);
router.get("/statistics", controller.getStatistic);
router.delete("/article/:id", controller.deleteArticle);
router.post("/addArticle", controller.addArticle);
export default router;
