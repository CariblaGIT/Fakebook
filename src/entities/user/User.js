import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: "default_avatar.png"
        },
        role: {
            type: String,
            enum: ["user", "admin", "super_admin"],
            default: "user"
        },
        followers:[{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        following:[{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const User = model('User', UserSchema);

export default User;