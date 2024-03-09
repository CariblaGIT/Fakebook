import bcrypt from "bcrypt";
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