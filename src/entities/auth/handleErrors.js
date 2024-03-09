
export const handleError = (res, errorMessage) => {
    let statusCode = 500;
    switch(errorMessage){
        case "Email or password invalids":
        case "No user exists, try again":
        case "Format email invalid":
        case "Format password invalid":
        case "Needed to have an email and a password":
        case "Needed to have an email, a password and a name":
            statusCode = 400;
            break;
    }
    return res.status(statusCode).json({
        success: false,
        message: errorMessage
    })
}