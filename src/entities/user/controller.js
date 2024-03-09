import User from "./User.js";
import { handleError } from "./handleErrors.js";

export const getUsers = async (req, res) => {
    try {
        const email = req.query.email;

        if(email){
            const user = await User.findOne({email: email}, '-password');

            if(!user){
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

        const user = await User.findById(userId, 'name email -_id');

        return res.status(200).json({
            success: true,
            message: "User profile retrieved succesfully",
            data: user
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

        await User.findByIdAndUpdate(
            userId,
            {
                name: name ? name : userToUpdate.name,
                email: email ? email : userToUpdate.email,
                password: password ? password : userToUpdate.password
            }
        )

        return res.status(200).json({
            success: true,
            message: "User profile updated succesfully"
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

        if(!role){
            throw new Error("Need a role to update a user role")
        }

        await User.findByIdAndUpdate(
            userId,
            {
                role: role
            }
        )

        return res.status(200).json({
            success: true,
            message: "Changed role succesfully"
        })
    } catch (error) {
        handleError(res, error.message)
    }
}