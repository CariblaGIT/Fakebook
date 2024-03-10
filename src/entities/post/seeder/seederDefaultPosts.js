import 'dotenv/config';
import Post from "../Post.js";
import mongoose from "mongoose";
import { dbConnection } from "../../../db.js"
import User from '../../user/User.js';

export const seederDefaultPosts = async () => {
    try {
		await dbConnection();
        const user1 = await User.findOne({name: "user"});
        const user1Id = (user1._id).toString()
        const user2 = await User.findOne({name: "user2"});
        const user2Id = (user2._id).toString()
        const likes = [user2Id, user1Id];
		await Post.create([
			{
                content: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
                text: "Passing a beautifull day in Paris :D",
                owner: user1Id,
                likes: likes,
                comments: [{
                    user: user2Id,
                    comment: "Wow! What an amazing view from there. Enjoy the travel :)"
                }]
            },
            {
                content: "https://andreuworld.com/media/catalog/product/import/galeria/proyectos/andreu_world_suitopia_hotel_6.webp",
                text: "Enjoying the views with some alcohol and friends X.X",
                owner: user2Id,
                likes: likes,
                comments: [{
                    user: user1Id,
                    comment: "Bartender! Cup here :3"
                }]
            }
		]);
		console.log("Post created");
	} catch (error) {
		console.log(error);
	} finally {
		mongoose.disconnect();
	}
}