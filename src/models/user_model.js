import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        // In Mongoose no need to add id column beacuse 
        UserName: {
            type: String,
            requried: true,
            trim: true,
            index: true,
            unique: true,
            lowercase: true
        },
        Email: {
            type: String,
            requried: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        FullName: {
            type: String,
            requried: true,
            trim: true,
            index: true
        },
        Password: {
            type: String,
            requried: [true, "Password is required"]
        },
        WatchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        IsDeleted: {
            type: TINYINT
        },
        RefreshToken: {
            type: String
        },
        Avatar: {
            type: String,
            requried: true
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
    if (!(this.isModified("password"))) return next();

    let salt = bcryptjs.genSalt(10);  //it means round of hashing.
    this.Password = await bcryptjs.hash(this.Password, salt);
    next();
});

// Now we create own methods also with userSchema.
userSchema.methods.isValidPassword = async function (password) {
    // compare the hashpassword of user with enter user's password. we use bcrypt's compare method. It return true/false.
    let isValidPassword = await bcryptjs.compare(password, this.Password);
    return isValidPassword;
}

userSchema.methods.generateAccessToken = async function () {
    let payload = {
        _id : this._id,
        Email : this.Email,
        Username : this.UserName,
        FullName : this.FullName
    }

    let jwtOptions = {
        expiresIn : "1h"
    }

    let token = jwt.sign(payload, jwtOptions, process.env.SECRET_ACCESSTOKEN);
    return token;
}

userSchema.methods.generateRefreshToken = async function () {
    let payload = {
        _id : this._id,
        Email : this.Email,
        Username : this.UserName,
        FullName : this.FullName
    }

    let jwtOptions = {
        expiresIn : "1d"
    }

    let token = jwt.sign(payload, jwtOptions, process.env.SECRET_ACCESSTOKEN);
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