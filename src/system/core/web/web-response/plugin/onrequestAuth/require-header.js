const fp = require('fastify-plugin');

module.exports = fp(async function requireHeader(fastify, opts) {
    // Name of the header (case-insensitive)
    const HEADER = (process.env.API_HEADER_NAME || 'G-DAS').toLowerCase();

    // Expected value (secret)
    const EXPECTED = process.env.API_HEADER_VALUE;

    if (!EXPECTED) {
        _sys.logger.always(
            'Error please set the secret key or you will be unprotected '
        );
        return;
    }

    // Run before anything else
    fastify.addHook('onRequest', (request, reply, done) => {
        const actual = request.headers[HEADER];
        if (!actual) {
            return reply.respond().unauthorized('Missing Authorization (Unauthorized client request)')
            return;
        }
        if (actual !== EXPECTED) {
            return reply.respond().unauthorized('Unauthorized client request')
            return;
        }
        done();
    });

    //fastify.log.info(`🔐 require-header plugin registered (header: ${HEADER})`);
});
