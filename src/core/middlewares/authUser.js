import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    try {
        const token = (req.headers.authorization).split(" ")[1];

        if (!token) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Unauthorized' 
                }
            )
        }

        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );

        req.tokenData = decoded;

        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "Token not valid or bad generated",
            error: error
        })
    }
};