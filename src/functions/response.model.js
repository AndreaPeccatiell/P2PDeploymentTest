class ResponseModel {
    constructor(statusCode, message, body) {
        this.statusCode = statusCode;
        this.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        };
        this.body = JSON.stringify({
            message,
            data: body,
        });
    }
}

module.exports = ResponseModel;
