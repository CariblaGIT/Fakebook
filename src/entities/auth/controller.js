import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/User.js";

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!email || !password || !name){
            return res.status(400).json({
                success: false,
                message: "Needed to have an email and a password"
            })
        }

        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Format email invalid"
                }
            )
        }

        const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
        if (password.length < 10 || !validPass.test(password) || password.includes(' ')){
            return res.status(400).json(
                {
                    success: false,
                    message: "Format password invalid"
                }
            )
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
        return res.status(500).json({
            success: false,
            message: "User cant be registered",
            error: error
        })
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Needed to have an email and a password"
            })
        }

        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Format email invalid"
                }
            )
        }

        const user = await User.findOne(
            {
                email: email
            }
        );

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Email or password invalid"
            })
        }

        const isPassValid = bcrypt.compareSync(password, user.password);
        if(!isPassValid){
            return res.status(400).json({
                success: false,
                message: "Email or password invalid"
            })
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
        return res.status(500).json({
            success: false,
            message: "Login user failure",
            error: error.message
        });
    }
};