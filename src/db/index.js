import mongoose from 'mongoose';
import { DB_NAME } from "../constants.js";
// Like here we are useing env file's data but here not import because we have config in main file.

const dbConnections = async () => {
    try{
        // here it get the MONGODB_URI from process.env/
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n Mongo DB Connected !! DB Host : ${connectionInstance.connections[0].host}`);
    }
    catch(err) {
            console.log("DB Connection Failed : ", err.message)
            process.exit(1);
    }
};

export default dbConnections;
