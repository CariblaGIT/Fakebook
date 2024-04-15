import 'dotenv/config';
import Post from "../Post.js";
import mongoose from "mongoose";
import { dbConnection } from "../../../db.js"

export const seederDefaultPosts = async () => {
    try {
		await dbConnection();
        const user1Id = "65ed7d2f6fa9305f1c42440f"
        const user2Id = "65ed7d2f6fa9305f1c424410"
        const likes = [user2Id, user1Id];
		await Post.create([
			{
                content: ["Michi.jpg"],
                text: "Typical Internet cat XD",
                owner: user1Id,
                likes: likes,
                comments: [{
                    user: user2Id,
                    comment: "I saw this kitten and Im in love"
                }],
                _id: new mongoose.Types.ObjectId("65ed83d651c924dbeba1bf9b")
            },
            {
                content: ["Michi.jpg"],
                text: "Best Michi ever",
                owner: user2Id,
                likes: likes,
                comments: [{
                    user: user1Id,
                    comment: "Beautiful kitten :3"
                }],
                _id: new mongoose.Types.ObjectId("65ed83d651c924dbeba1bf99")
            }
		]);
		console.log("Default posts created");
	} catch (error) {
		console.log(error);
	} finally {
		mongoose.disconnect();
	}
}