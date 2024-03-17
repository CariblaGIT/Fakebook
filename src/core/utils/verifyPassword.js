
export const verifyPassword = (password) => {
    const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
    return (password.length < 10 || !validPass.test(password) || password.includes(' '))
        ? false
        : true
}