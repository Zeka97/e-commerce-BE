import dotenv from "dotenv";

dotenv.config();

export const { PORT, HOST, DATABASE, PASSWORD, USER } = process.env;
