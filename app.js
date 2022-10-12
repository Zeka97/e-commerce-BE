import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

import indexRouter from "./routes/loginandregister/index.js";
import usersRouter from "./routes/users/index.js";
import artikliRouter from "./routes/artikli/index.js";
import kategorijeRouter from "./routes/kategorije/index.js";

const app = express();

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

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/artikli", artikliRouter);
app.use("/kategorije", kategorijeRouter);

export default app;
