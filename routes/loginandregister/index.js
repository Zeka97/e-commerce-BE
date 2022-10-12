import express from "express";

import * as controller from "./controller.js";

const router = express.Router();

router.post("/login", controller.checkLogin);

router.post("/register", controller.registerUser);

export default router;
