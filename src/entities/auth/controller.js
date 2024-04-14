import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/User.js";
import { handleError } from "./handleErrors.js";
import { verifyEmail } from "../../core/utils/verifyEmail.js";
import { verifyPassword } from "../../core/utils/verifyPassword.js";

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!email || !password || !name){
            throw new Error("Needed to have an email, a password and a name");
        }

        if (!verifyEmail(email)) {
            throw new Error("Format email invalid");
        }

        if (!verifyPassword(password)){
            throw new Error("Format password invalid");
        }

        const passwordEncrypted = bcrypt.hashSync(password, 5);

        await User.create({
            name,
            email,
            password: passwordEncrypted
        })

        return res.status(201).json({
            success: true,
            message: "User registered succesfully"
        })
    } catch (error) {
        handleError(res, error.message);
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            throw new Error("Needed to have an email and a password");
        }

        if (!verifyEmail(email)) {
            throw new Error("Format email invalid");
        }

        const user = await User.findOne(
            {
                email: email
            }
        );

        if(!user){
            throw new Error("No user exists, try again");
        }

        const isPassValid = bcrypt.compareSync(password, user.password);
        if(!isPassValid){
            throw new Error("Email or password invalids");
        } 

        const token = jwt.sign(
            {
                userId: user.id,
                name: user.name,
                avatar: user.avatar,
                roleName: user.role
            },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            success: true,
            message: "User logged successfully",
            token: token
        })
    } catch (error) {
        handleError(res, error.message);
    }
};