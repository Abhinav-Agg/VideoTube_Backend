import dotenv from 'dotenv';
import dbConnections from '../src/db/index.js';  // In module type when we import any file also required ext name of file. if we do not add extension of file we will get error in console.
import app from './app.js';

// when we configure the dotenv, its will be accessible in whole application. That's why! we configure the dotenv like below.
dotenv.config({
    path: "./.env"
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
});

dbConnections(); 