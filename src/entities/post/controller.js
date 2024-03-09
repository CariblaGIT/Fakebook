import Post from "./Post.js";

export const makingPost = async (req, res) => {
    try {
        const {content, text} = req.body;
        const owner = req.tokenData.userId;

        if(!text){
            return res.status(400).json({
                success: false,
                message: "Needed to have a text to create a post"
            })
        }

        await Post.create({
            content,
            text,
            owner
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

export const allPosts = async (req, res) => {
    try {
        const posts = await Post.find({});

        if(posts.length === 0){
            return res.status(404).json({
                success: true,
                message: "No posts have been found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Posts retrieved succesfully",
            data: posts
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Posts cant be retrieved",
            error: error
        })
    }
}

export const myPosts = async (req, res) => {
    try {
        const userId = req.tokenData.userId;

        const posts = await Post.find({owner: userId});

        if(posts.length === 0){
            return res.status(404).json({
                success: true,
                message: "No posts from that user have been found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Posts retrieved succesfully",
            data: posts
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Posts cant be retrieved",
            error: error
        })
    }
}

export const postById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                success: true,
                message: "No post has been found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Post retrieved succesfully",
            data: post
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Post cant be retrieved",
            error: error
        })
    }
}