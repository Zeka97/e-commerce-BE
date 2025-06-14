import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import indexRouter from "./routes/loginandregister/index.js";
import usersRouter from "./routes/users/index.js";
import artikliRouter from "./routes/artikli/index.js";
import kategorijeRouter from "./routes/kategorije/index.js";
import adminRouter from "./routes/admin/index.js";
import * as articlesController from "./routes/artikli/controller.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from the public directory
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/image/:imagePath(*)", articlesController.getImage);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/artikli", artikliRouter);
app.use("/kategorije", kategorijeRouter);
app.use("/admin", adminRouter);

export default app;
