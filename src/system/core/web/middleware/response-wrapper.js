let messege = "";
function responseWrapper(fastify) {



    // Serialize successful and error responses
    fastify.addHook('onSend', async (request, reply, payload) => {
        try {
            let parsed;

            try {
                parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
                messege ='success'

            } catch {
                parsed = payload; // In case it's not JSON, e.g. raw string
            }

            if (reply.statusCode >= 400) {
               _sys.logger.error("error validation error web wrapper")
            }

            if(process.env.NODE_ENV === 'DEV') {_sys.logger.inReq( JSON.stringify({data: parsed}));} // logging api response only in dev /local mode


            return JSON.stringify({
                statusCode: reply.statusCode,
                message: messege,
                data: parsed,

            });

        } catch (error) {
            return JSON.stringify({
                statusCode: 500,
                error: 'ResponseWrapperError',
                message: 'Failed to format response'
            });
        }
    });

    // Centralized error handler (e.g. for malformed JSON, validation, etc.)
    fastify.setErrorHandler((err, request, reply) => {
        const statusCode = err.statusCode || 500;

        if (err.validation) {
            return reply.code(400).send({
                error: 'Validation Error',
                message: err.message
            });
        }

        // Catch JSON parse errors or others
        if (err instanceof SyntaxError && err.message.includes('JSON')) {
            return reply.code(400).send({
                error: 'Invalid JSON',
                message: 'Malformed JSON payload'
            });
        }

        reply.code(statusCode).send({
            error: err.name || 'Error',
            message: err.message || 'Unexpected error'
        });
    });

    _sys.logger.log("✅ Web-wrapper registered");
}

module.exports = responseWrapper;
