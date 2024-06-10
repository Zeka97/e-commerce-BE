import Knex from 'knex';

const USER = 'oytftnqj';
const HOST = 'balarama.db.elephantsql.com';
const DATABASE = 'oytftnqj';
const PASSWORD = 'tkiH1rq1R3_7tRxhGGb62VQr8ZQlcnKY';

const knex = Knex({
    client: 'pg',
    connection: {
        host: HOST,
        port: 5432,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        ssl: { rejectUnauthorized: false }, // Enable SSL
    },
    pool: {
        max: 9,
    },
    acquireConnectionTimeout: 10000,
});

export default knex;
