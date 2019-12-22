const pg = require('pg');
const address = 'postgresql://localhost:5432/greenfield';
const pgClient = new pg.Client(address);
pgClient.connect();

module.exports.db = pgClient;