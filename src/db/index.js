import { Sequelize } from "sequelize";
import config from "../config/config.js";

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.SQL_PORT,
        dialect: config.dialect
    }
)

// This method used for test connection sequelize with db.
const dbConnections = async () => {
    try{
        await sequelize.authenticate();
        console.log("DATABASE CONNECTED");
    }
    catch(err) {
            console.log("DB Connection Failed : ", err.message)
    }
};

export default dbConnections;
