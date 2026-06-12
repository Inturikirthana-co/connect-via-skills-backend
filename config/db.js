const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "connect_skills",
  password: "kirthana",
  port: 5432,
});

module.exports = pool;