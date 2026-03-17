const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000,
        requestTimeout: 30000
    }
};

const pool = new sql.ConnectionPool(config);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

pool.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err));

module.exports = pool;