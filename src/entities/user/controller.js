import User from "./User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');

        if(!users){
            return res.status(404).json({
                success: false,
                message: "You cant find users"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Users retrieved succesfully",
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Users cant be retrieved",
            error: error
        })
    }
}

export const getProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User profile retrieved succesfully"
    })
}