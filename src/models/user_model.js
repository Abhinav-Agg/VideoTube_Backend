import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

const {parsed} = dotenv.config();

const userSchema = new Schema(
    {
        // In Mongoose no need to add id column beacuse 
        Username: {
            type: String,
            required: true,
            trim: true,
            index: true,
            unique: true,
            lowercase: true
        },
        Email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        FullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        Password: {
            type: String,
            requried: [true, "Password is required"]
        },
        WatchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        IsDeleted: {
            type: Boolean
        },
        RefreshToken: {
            type: String
        },
        Avatar: {
            type: String,
            required: true
        },
        CoverImage: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// pre is the method of mongoose which call the callback method when we add mongoose db methods like save, update and etc. so when these type of method call, pre call the callback method.
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();

    let salt = await bcryptjs.genSalt(10);  
    this.Password = await bcryptjs.hash(this.Password, salt);

    next();
});

// Now we create own methods also with userSchema.
// compare the hashpassword of user with enter user's password. we use bcrypt's compare method. It return true/false.
userSchema.methods.isValidPassword = async function (password) {
    let isValidPassword = await bcryptjs.compare(password, this.Password);
    
    return isValidPassword;
}

userSchema.methods.generateAccessToken = function () {
    let payload = {
        _id: this._id,
        Email: this.Email,
        Username: this.UserName,
        FullName: this.FullName
    }

    let jwtOptions = {
        expiresIn: "1m"
    }

    let token = jwt.sign(payload, process.env.SECRET_ACCESSTOKEN,  jwtOptions);
    return token;
}

userSchema.methods.generateRefreshToken = function () {
    let payload = {
        _id: this._id,
        Email: this.Email,
        Username: this.UserName,
        FullName: this.FullName
    }

    let jwtOptions = {
        expiresIn: "1d"
    }

    let token = jwt.sign(payload, process.env.SECRET_ACCESSTOKEN, jwtOptions);
    return token;
}

export const Users = mongoose.model("Users", userSchema);
// here we give schema type because we add columns in schema.

// Note :- Most Important why we create methods here and what the benefit we get.
/*
Here we created methods because we requried a model columns for data. that's why we use userSchema and created methods here. Whereas in sequelize we call the model and store the instance of
model in object so that we will able to use model columns to save data in table.
Most Imp -> schema se data mill pata hai columns ka with the help of mongoose. due to this we userSchema and thier columns for some methods which common used which never changed that's why
we are created and else we need to get data from db and then create logic for below stuff. Also we will create in another file using model.But we need to pass req and get data.
*/