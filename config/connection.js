require('dotenv').config();
const mysql = require('mysql');


const db = mysql.createConnection({   //solicitação de conexão
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_DATABASE
});

db.connect(); //ligar a conexão com mysql

module.exporte = db