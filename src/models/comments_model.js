import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        Content : {
            type : String        
        },
        Video : {
            type: Schema.Types.ObjectId,
            ref: "Videos"
        },
        Owner :{
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
    },
    {
        timestamps : true
    }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comments = mongoose.model("Comments", commentSchema);