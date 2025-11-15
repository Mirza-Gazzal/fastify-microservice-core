const fp = require('fastify-plugin');

module.exports = fp(async function (fastify) {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.JWT_SECRET,
        sign: { expiresIn: process.env.JWT_EXPIRY },
    });

    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
           // reply.code(401).send({ error: 'jwt plugin Unauthorized' });
            return reply.respond().unauthorized('Request is unauthorized ' );
        }
    });

});