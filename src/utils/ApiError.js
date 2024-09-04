// Here we handle the API error which we get.
// Here Error is class of NodeJs which used for APi. This type of code used in Industry.
class ApiError extends Error{
    constructor( statusCode, message = "Something went wrong", errors = [], stack = "" ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        // Stack is ErrorStack which offers a trace of which functions were called, in what order, from which line and file, and with what arguments. Basically it shows an error.
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    } 
}

export {ApiError}