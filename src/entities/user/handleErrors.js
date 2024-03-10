export const handleError = (res, errorMessage) => {
    let statusCode = 500;
    switch(errorMessage){
        case "Need a role to update a user role":
        case "Format password invalid":
        case "Email format invalid":
        case "Need to bring data to update a user":
            statusCode = 400
            break;
        case "You cant find a user with that email":
        case "You cant find users":
        case "No posts from that user have been found":
            statusCode = 404
            break;
    }
    return res.status(statusCode).json({
        success: false,
        message: errorMessage
    })
}