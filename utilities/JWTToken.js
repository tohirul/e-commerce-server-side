// Function to generate auth tokens and sending response to requests
const sendToken = (user, statusCode, res) => {
    // Creating a token to save as a cookie
    // JWT token from userSchema.methods
    const token = user.getJWTToken();

    // Options for Cookie
    const options = {
        // expiration date for the cookie
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user,
    });
};

module.exports = sendToken;
