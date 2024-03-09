import Post from "./Post.js";
import { handleError } from "./handleErrors.js";

export const makingPost = async (req, res) => {
    try {
        const {content, text} = req.body;
        const owner = req.tokenData.userId;

        if(!text){
            throw new Error ("Needed to have a text to create a post");
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
        handleError(res, error.message)
    }
}

export const allPosts = async (req, res) => {
    try {
        const posts = await Post.find({});

        if(posts.length === 0){
            throw new Error ("No posts have been found");
        }

        return res.status(200).json({
            success: true,
            message: "Posts retrieved succesfully",
            data: posts
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const myPosts = async (req, res) => {
    try {
        const userId = req.tokenData.userId;

        const posts = await Post.find({owner: userId});

        if(posts.length === 0){
            throw new Error ("No posts from that user have been found");
        }

        return res.status(200).json({
            success: true,
            message: "Posts retrieved succesfully",
            data: posts
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const postById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            throw new Error ("No post has been found");
        }

        return res.status(200).json({
            success: true,
            message: "Post retrieved succesfully",
            data: post
        })
    } catch (error) {
        handleError(res, error.message);
    }
}

export const updatePost = async (req, res) => {
    try {
        const {postId, content, text} = req.body;
        const userId = req.tokenData.userId;

        if(!postId){
            throw new Error ("No introduced post reference");
        }

        if(!content && !text){
            throw new Error ("No introduced data to update the post");
        }

        const postToUpdate = await Post.findById(postId);

        if(!postToUpdate){
            throw new Error ("No post has been found");
        }

        if((postToUpdate.owner).toString() !== userId){
            throw new Error ("Unauthorized to change that post")
        }

        await Post.findByIdAndUpdate(
            postId,
            {
                content: content ? content : postToUpdate.content,
                text: text ? text : postToUpdate.text,
            }
        )

        return res.status(200).json({
            success: true,
            message: "Post updated succesfully"
        })
    } catch (error) {
        handleError(res, error.message);
    }
}

export const deletePost = async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        const postId = req.params.id;

        const postToDelete = await Post.findById(postId);

        if((postToDelete.owner).toString() !== userId){
            throw new Error ("Unauthorized to delete that post")
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted succesfully"
        })
    } catch (error) {
        handleError(res, error.message)
    }
}