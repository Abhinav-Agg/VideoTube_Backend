import dotenv from 'dotenv';
import dbConnections from '../src/db/index.js';

dotenv.config({
    path: "./.env"
});

dbConnections();