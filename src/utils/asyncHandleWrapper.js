/*
Here, we use Higher order function in terms of arrow function. if we need to understand more below code is too same where I written basic function syntax to udnerstand using HOF.
As we Higher Order function requires a parameter for call function which we gave at time of return function in main function also for inner function. then possible, function will
be call returned function.
*/

// This function creates so that we do not create try catch in every async function, now we call this function and give the other function as parameter in this.
let asyncHandler = (funcs) => async (req, res, next) => {
    try {
        await funcs(req, res, next);
    }
    catch (err) {
        res.status(500).send({
            Success : "Failure",
            Message : err.message 
        })
    }
}

// Its Basic syntax of higher order function for understanding purpose for above.
/*
function asyncHandler(func) {
    return async function n(req,res,next) {
        try {
            await func(req, res, next);
        }
        catch (err) {
            res.status(500).send({
                Success : "Failure",
                Message : err.message 
            })
        }
    }
} 
*/

export {asyncHandler}