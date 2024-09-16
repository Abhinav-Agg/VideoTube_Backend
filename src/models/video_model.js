import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// here we create the schema obj.
const videoSchema = new Schema(
    {
        VideoFIle: {
            type: String,   //Cloudinary Url -> Basically it returns the file data.
            required: true
        },
        Thumbnail: {
            type: String,
            required: true
        },
        Owner: [
            {
                // Object Id -> we take this so that we are insert in this more 1 data like Id for user and fullname of user. So it will show these record in object form that's why!.
                type: Schema.Types.ObjectId,
                ref: "Users"
            }
        ],
        Title: {
            type: String,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        IsDeleted: {
            type: Boolean
        },
        Duration: {
            type: Number,  //Cloudinary Url -> We get duration from file data which it returns.
            required: true
        },
        Views: {
            type: Number,
            default: 0
        },
        IsPublished: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Videos = mongoose.model("Videos", videoSchema);