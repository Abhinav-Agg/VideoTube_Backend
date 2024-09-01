import dotenv from 'dotenv';
const process = dotenv.config();  

export default {
    development: {
        "username": process.parsed.USER,
        "password": process.parsed.PASSWORD,
        "database": process.parsed.DB,
        "host": process.parsed.HOST,
        "dialect": process.parsed.DIALECT,
        "SQL_PORT": process.parsed.SQL_PORT
    },
    test: {
      // add test configuration if needed
    },
    production: {
      // add production configuration if needed
    },
}

