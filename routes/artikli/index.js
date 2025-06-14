import express from "express";

import * as controller from "./controller.js";

const router = express.Router();

router.get("/", controller.getAllArticles);
router.get("/artikal", controller.getArticle);
router.get("/image/:imagePath(*)", controller.getImage);

export default router;
