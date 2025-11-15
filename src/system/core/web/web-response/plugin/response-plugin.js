const fp = require('fastify-plugin');
const ResponseFormatter = require('../ResponseFormatter');

async function responsePlugin(fastify) {


    fastify.decorateReply('respond', function () {

        return new ResponseFormatter(this);

    });
}

module.exports = fp(responsePlugin);