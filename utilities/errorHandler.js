// A class component to produce error message to send every time
// an error is conceived
class ErrorHandler extends Error {
    constructor(message, statuscode) {
        super(message);
        this.statuscode = statuscode;
        Error.captureStackTrace(this, this.constructor);
        /* captureStackTrace: gives us a stack that helps us to find the location of that error in the code
         at which new Error() was Called. this will help us to find the exact error in our code. */
    }
}
module.exports = ErrorHandler;
