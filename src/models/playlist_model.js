import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        PlaylistName : {
            type : String
        },
        Description : {
            type : String
        },
        Videos : [
            {
                type: Schema.Types.ObjectId,
                ref: "Videos"
            }
        ],
        Owner: [
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

export const Playlist = mongoose.model("Playlist", playlistSchema);