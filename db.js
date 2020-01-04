const pg = require('pg');
const pgClient = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'greenfield',
  user: 'postgres',
  password: 'postgres'
});
pgClient.connect();

module.exports = pgClient;