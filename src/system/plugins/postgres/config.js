require('dotenv').config();

module.exports = {
    postgres: {
        database: process.env.PG_DB,
        username: process.env.PG_USER,
        password: process.env.PG_PASS,
        options: {
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            dialect: 'postgres',
            logging: false, // optional
        },
    },
};
