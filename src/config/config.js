import dotenv from 'dotenv';
const process = dotenv.config();  //with import (ES6 fetaure for export and importing files). With this now env data get in parsed.

const development = {
    "username": process.parsed.USER,
    "password": process.parsed.PASSWORD,
    "database": process.parsed.DB,
    "host": process.parsed.HOST,
    "dialect": process.parsed.DIALECT,
    "SQL_PORT": process.parsed.SQL_PORT,
}

export default development;