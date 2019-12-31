const pg = require('pg');
// const address = 'postgresql://blackwayv:esiscool99@/localhost:5432/greenfield';
const pgClient = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'greenfield',
  user: 'postgres',
  password: 'postgres'
});
pgClient.connect();

module.exports = pgClient;