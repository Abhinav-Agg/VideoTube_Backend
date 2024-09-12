// When we send response we use this class and we have created own class. There is no class of Node.
class ApiResponse{
    constructor(statusCode, data, message = 'Success'){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {ApiResponse};