import User from "../user/User.js";
import Post from "./Post.js";
import { handleError } from "./handleErrors.js";

export const makingPost = async (req, res) => {
    try {
        const {content, text} = req.body;
        const owner = req.tokenData.userId;

        if(!text){
            throw new Error ("Needed to have a text to create a post");
        }

        const postCreated = await Post.create({
            content,
            text,
            owner
        })

        return res.status(201).json({
            success: true,
            message: "Post uploaded succesfully",
            data: postCreated
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const allPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate({path: "likes owner", select:"name"}).populate({path: "comments", populate:{path: "user", select:"name"}});

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

        const posts = await Post.find({owner: userId}).populate({path: "likes owner", select:"name"}).populate({path: "comments", populate:{path: "user", select:"name"}});

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

        const post = await Post.findById(postId).populate({path: "likes owner", select:"name"}).populate({path: "comments", populate:{path: "user", select:"name"}});

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

        if((postToUpdate.owner).toString() !== userId){
            throw new Error ("Unauthorized to change that post")
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                content: content ? content : postToUpdate.content,
                text: text ? text : postToUpdate.text,
            }
        ).populate({path: "likes owner", select:"name"}).populate({path: "comments", populate:{path: "user", select:"name"}});

        return res.status(200).json({
            success: true,
            message: "Post updated succesfully",
            data: updatedPost
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

export const giveOrRemoveLikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.tokenData.userId;
        let isLiked = false;

        const postInteracted = await Post.findById(postId).populate({path: "likes owner", select:"name"}).populate({path: "comments", populate:{path: "user", select:"name"}});

        (postInteracted.likes).forEach(user => {
            if(user.toString() === userId){
                isLiked = true;
            }
        });

        if(isLiked){
            postInteracted.likes.pull(userId);
            await postInteracted.save();
        } else {
            postInteracted.likes.push(userId);
            await postInteracted.save();
        }

        await postInteracted.populate({path: "likes owner", select:"name"}).populate({path: "comments", populate:{path: "user", select:"name"}});

        return res.status(200).json({
            success: true,
            message: "Giving or removing like to post done succesfully",
            data: postInteracted
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const makingCommentIntoPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.tokenData.userId;
        const comment = req.body.comment;

        if(!comment){
            throw new Error("No comment text introduced");
        }

        const postInteracted = await Post.findById(postId);

        postInteracted.comments.push({
            user: userId,
            comment
        })

        await postInteracted.save();

        await postInteracted.populate({path: "likes owner", select:"name"});
        await postInteracted.populate({path: "comments", populate:{path: "user", select:"name"}});

        return res.status(200).json({
            success: true,
            message: "Comment into post done succesfully",
            data: postInteracted
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const postId = req.params.postId;
        const userId = req.tokenData.userId;

        const postInteracted = await Post.findById(postId).populate({path: "likes owner", select:"name"},).populate({path: "comments", populate:{path: "user", select:"name"}});

        const comments = postInteracted.comments;
        let comment;

        for(let i = 0; i < comments.length; i++){
            if((comments[i]._id).toString() === commentId){
                comment = comments[i]
            }
        }

        if(!comment){
            throw new Error ("No comment from that post")
        }

        if((comment.user._id).toString() !== userId){
            throw new Error ("Unauthorized to delete that comment")
        }

        postInteracted.comments.pull(comment);

        await postInteracted.save();

        return res.status(200).json({
            success: true,
            message: "Comment into post removed succesfully",
            data: postInteracted
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const getTimeline = async (req, res) => {
    try {
        const userId = req.tokenData.userId;

        const user = await User.findById(userId);
        const followingUsers = user.following;

        const postTimeline = await Post.find({owner: {$in: followingUsers}}).sort({createdAt: 'descending'}).populate({path: "likes owner", select:"name"},).populate({path: "comments", populate:{path: "user", select:"name"}});

        return res.status(200).json({
            success: true,
            message: "Posts timeline retrieved succesfully",
            data: postTimeline
        })
    } catch (error) {
        handleError(res, error.message)
    }
}