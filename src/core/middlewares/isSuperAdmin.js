
export const verifySuperAdmin = (req, res, next) => {
    try {
        const userRole = req.tokenData.roleName;

        if(userRole !== "super_admin"){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "Dont have permissions",
            error: error
        })
    }
}