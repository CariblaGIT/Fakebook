import bcrypt from "bcrypt";
import User from "./User.js";
import Post from "../post/Post.js";
import { handleError } from "./handleErrors.js";
import { verifyEmail } from "../../core/utils/verifyEmail.js";
import { verifyPassword } from "../../core/utils/verifyPassword.js";

export const getUsers = async (req, res) => {
    try {
        const email = req.query.email;

        if(email){
            const user = await User.findOne({email: email}).populate({path: "following followers", select:"name"});

            if(user == null){
                throw new Error("You cant find a user with that email")
            }

            return res.status(200).json({
                success: true,
                message: "User retrieved succesfully",
                data: user
            })
        }

        const users = await User.find({}).populate({path: "following followers", select:"name"});

        if(!users){
            throw new Error("You cant find users")
        }

        return res.status(200).json({
            success: true,
            message: "Users retrieved succesfully",
            data: users
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const getUsersAsUser = async (req, res) => {
    try {

        const users = await User.find({}, '-password').populate({path: "following followers", select:"name"});

        if(!users){
            throw new Error("You cant find users")
        }

        return res.status(200).json({
            success: true,
            message: "Users retrieved succesfully",
            data: users
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.tokenData.userId;

        const user = await User.findById(userId, 'name email _id').populate({path: "following followers", select:"name"});

        return res.status(200).json({
            success: true,
            message: "User profile retrieved succesfully",
            data: user
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const postsFromUser = async (req, res) => {
    try {
        const userId = req.params.userId;

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

export const modifyProfile = async (req, res) => {
    try {
        let {name, email, password} = req.body;
        const avatar = req.file?.filename;
        const userId = req.tokenData.userId;

        if(!name && !email && !password){
            throw new Error("Need to bring data to update a user")
        }

        const userToUpdate = await User.findById(userId)

        if(email){
            if (!verifyEmail(email)) {
                throw new Error("Email format invalid")
            } else {
                userToUpdate.email = email;
            }
        }

        if(password){
            if (!verifyPassword(password)){
                throw new Error("Format password invalid")
            } else {
                password = bcrypt.hashSync(password, 5);
                userToUpdate.password = password;
            }
        }

        if(name){
            userToUpdate.name = name;
        }

        if(avatar){
            userToUpdate.avatar = avatar;
        }

        userToUpdate.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated succesfully",
            data: userToUpdate
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id

        await User.deleteOne({ _id: userId })

        return res.status(200).json({
            success: true,
            message: "User deleted succesfully"
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id
        const role = req.body.role
        const possibleRoles = ["super_admin", "admin", "user"];

        if(!role){
            throw new Error("Need a role to update a user role")
        }

        if (!possibleRoles.includes(role)){
            throw new Error("Not valid role")
        }

        const userRoleChanged = await User.findByIdAndUpdate(
            userId,
            {
                role: role
            }
        )

        return res.status(200).json({
            success: true,
            message: "Changed role succesfully",
            data: userRoleChanged
        })
    } catch (error) {
        handleError(res, error.message)
    }
}

export const followOrUnfollowUser = async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        const userToFollowInteractionId = req.params.id;

        if(userId === userToFollowInteractionId){
            throw new Error("You cant follow yourself")
        }

        const user = await User.findById(userId);
        const userToFollowInteraction = await User.findById(userToFollowInteractionId);

        if(user.following.includes(userToFollowInteractionId)){
            user.following.pull(userToFollowInteractionId);
            userToFollowInteraction.followers.pull(userId);
        } else {
            user.following.push(userToFollowInteractionId);
            userToFollowInteraction.followers.push(userId);
        }

        await user.save();
        await userToFollowInteraction.save();

        await user.populate({path: "following followers", select:"name"})

        return res.status(200).json({
            success: true,
            message: "Follow or unfollow user succesfully",
            data: user
        })
    } catch (error) {
        handleError(res, error.message)
    }
}