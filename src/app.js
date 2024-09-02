// Here we create app as of now we add all stuff related to routes , middleware inshort which are used with app we use here.
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// as we know that app.use() used for middleware so we add only middleware package like cors, cookie-parser etc.
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
})); 

// express.json -> its basically used for getting data from body in req. before this method we are using body-parser middleware but now its integrated inside the express.json().
app.use(express.json());
app.use(express.urlencoded({extended : true}));   //its used for getting data from url which we gave sometime in the url.
app.use(express.static("public"));
app.use(cookieParser());
// cookieParser() is another middleware which used where we stored the set data inside the browser or get data which only read by our server only i.e cookies.

// Import route.
import userRouter from './routes/user_routes.js'

// declaration route
app.use('/api/v1/users' , userRouter);


export default app;