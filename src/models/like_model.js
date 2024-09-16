import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        comment :  [
            {
                type: Schema.Types.ObjectId,
                ref: "Comments"
            }
        ],
        Video : [
            {
                type: Schema.Types.ObjectId,
                ref: "Videos"
            }
        ],
        LikedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "Users"
            }
        ],
    },
    {
        timestamps: true
    }
);


export const Like = mongoose.model("Like", likeSchema);