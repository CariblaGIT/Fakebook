import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/User.js";
import { handleError } from "./handleErrors.js";

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!email || !password || !name){
            throw new Error("Needed to have an email, a password and a name");
        }

        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            throw new Error("Format email invalid");
        }

        const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
        if (password.length < 10 || !validPass.test(password) || password.includes(' ')){
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

        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
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