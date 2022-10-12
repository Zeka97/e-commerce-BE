import express from "express";
import * as controller from "./controller.js";

const router = express.Router();

router.get("/listanarudzbi", controller.listaNarudzbi);
router.post("/kreirajnarudzbu", controller.kreirajNarudzbu);

export default router;
