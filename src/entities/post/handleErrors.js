
export const handleError = (res, errorMessage) => {
    let statusCode = 500;
    switch(errorMessage){
        case "Needed to have a text to create a post":
        case "No introduced data to update the post":
        case "No introduced post reference":
        case "No comment text introduced":
            statusCode = 400
            break;
        case "Unauthorized to delete that post":
        case "Unauthorized to change that post":
        case "Unauthorized to delete that comment":
            statusCode = 401
            break;
        case "No posts from that user have been found":
        case "No comment from that post":
            statusCode = 404
            break;
    }
    return res.status(statusCode).json({
        success: false,
        message: errorMessage
    })
}