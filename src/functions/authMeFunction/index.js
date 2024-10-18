const { app } = require('@azure/functions');
const { lambdaHandler } = require('../lambdaHandler'); // Import the business logic

app.http('authMeFunction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            context.log('Request received:', request.url);

            // Simulate Lambda event structure
            const event = {
                body: JSON.stringify(await request.json()),  // Capture the request body
                queryStringParameters: Object.fromEntries(request.query)  // Capture query params if needed
            };

            // Call the lambda handler function (your business logic)
            const response = await lambdaHandler(event);

            // Respond with the same format as in your Express server
            return {
                status: response.statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  // Allow CORS for all origins
                },
                body: JSON.stringify({
                    message: JSON.parse(response.body).message,
                    data: JSON.parse(response.body).data
                })
            };

        } catch (error) {
            context.log('Error occurred:', error.message);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
            };
        }
    }
});
