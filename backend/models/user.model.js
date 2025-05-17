import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            default: "",
        },
        profileUrl: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
        },
        likedprofiles: {
            type: [String],
            default: [],
        },
        likedBY: [
            {
                userName: {
                    type: String,
                    required: true,
                },
                avatarUrl: {
                    type: String,
                },
                likedDate: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const user = mongoose.model("User", userSchema)

export default user;

