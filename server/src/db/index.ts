import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  // @ts-ignore
  port: process.env.PGPORT,
});

export default {
  query: (text: any, params: any) => pool.query(text, params),
};
