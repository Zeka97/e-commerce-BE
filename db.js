import Knex from "knex";

const USER = "postgres";
const HOST = "localhost";
const DATABASE = "postgres";
const PASSWORD = "postgres";

const knex = Knex({
  client: "pg",
  connection: {
    host: HOST,
    port: 5432,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    ssl: false, // Enable SSL
  },
  pool: {
    max: 9,
  },
  acquireConnectionTimeout: 10000,
});

export default knex;
