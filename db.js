import Knex from "knex";
import { HOST, USER, PASSWORD, DATABASE } from "./config/env.js";

const knex = Knex({
  client: "pg",
  connection: {
    host: process.env.HOST,
    port: 5432,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  pool: {
    max: 3,
  },
  acquireConnectionTimeout: 10000,
});

export default knex;
