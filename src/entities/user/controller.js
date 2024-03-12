import bcrypt from "bcrypt";
import User from "./User.js";
import Post from "../post/Post.js";
import { handleError } from "./handleErrors.js";

export const getUsers = async (req, res) => {
    try {
        const email = req.query.email;

        if(email){
            const user = await User.findOne({email: email}, '-password');

            if(user == null){
                throw new Error("You cant find a user with that email")
            }

            return res.status(200).json({
                success: true,
                message: "User retrieved succesfully",
                data: user
            })
        }

        const users = await User.find({}, '-password');

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

        const user = await User.findById(userId, 'name email _id');

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
        const userId = req.tokenData.userId;

        if(!name && !email && !password){
            throw new Error("Need to bring data to update a user")
        }

        if(email){
            const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!validEmail.test(email)) {
                throw new Error("Email format invalid")
            }
        }

        if(password){
            const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
            if (password.length < 10 || !validPass.test(password) || password.includes(' ')){
                throw new Error("Format password invalid")
            } else {
                password = bcrypt.hashSync(password, 5);
            }
        }

        const userToUpdate = User.findById(userId);

        const userUpdated = await User.findByIdAndUpdate(
            userId,
            {
                name: name ? name : userToUpdate.name,
                email: email ? email : userToUpdate.email,
                password: password ? password : userToUpdate.password
            }
        )

        return res.status(200).json({
            success: true,
            message: "User profile updated succesfully",
            data: userUpdated
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