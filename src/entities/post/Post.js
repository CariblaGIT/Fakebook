import { Schema, model } from "mongoose";

const PostSchema = new Schema(
    {
        content: {
            type: [String],
            required: false
        },
        text: {
            type: String,
            required: true
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String,
                required: true
            }
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Post = model('Post', PostSchema);

export default Post;