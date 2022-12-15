import express from "express";
import * as controller from "./controller.js";

const router = express.Router();

router.get("/listanarudzbi", controller.listaNarudzbi);
router.post("/kreirajnarudzbu", controller.kreirajNarudzbu);
router.post("/updateUserProfile", controller.updateUserProfile);
router.post("/changePassword", controller.changePassword);

export default router;
