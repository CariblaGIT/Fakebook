import Post from "./Post.js";

export const makingPost = async (req, res) => {
    try {
        const {content, text} = req.body;

        if(!text){
            return res.status(400).json({
                success: false,
                message: "Needed to have a text to create a post"
            })
        }

        await Post.create({
            content,
            text
        })

        return res.status(201).json({
            success: true,
            message: "Post uploaded succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Post cant be uploaded",
            error: error
        })
    }
}