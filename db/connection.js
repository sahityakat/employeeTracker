const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'K@@bil123',
      database: 'employee'
    },
);

module.exports = db;