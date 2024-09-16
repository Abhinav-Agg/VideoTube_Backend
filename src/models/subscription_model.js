import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        Subscriber: {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
        Channel: {
            type: Schema.Types.ObjectId,
            ref: "Users"
        }
    },
    {
        timestamps : true
    }
);

export const Subscription = mongoose.model("SubscriptionUsers", subscriptionSchema);