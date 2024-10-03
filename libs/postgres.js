const { Client } = require('pg');

async function getConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: 'password',
    database: 'db_mystore',
  });

  await client.connect();

  return client;
}

module.exports = {
  getConnection,
};
