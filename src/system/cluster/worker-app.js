const path = require('path');
const fastifyFactory = require('fastify');
const responseWrapper = require('../../system/core/web/middleware/response-wrapper');
const responseWrapper2 = require('../core/web/web-response/plugin/response-plugin.js');
const isWorkerQuiet = process.env.WORKER_LOG_QUIET === 'true';
const cluster = require('cluster');
const jwtToken = require('../plugins/jwt/jwt');



async function bootstrapApp(server) {
    const isFirstWorker = cluster.worker?.id === 1; // get the first worker allow only  worker 1 to logg for fastify ( less and more clear logging way)
 
    const fastify = fastifyFactory({ logger: true, server });


    // -----Response wrapper/response section ( web - response )-----
    await fastify.register(responseWrapper2); // the improved and advanced web-response
    await fastify.register(jwtToken);

    
   // await fastify.register(require('../../system/core/web/web-response/plugin/onrequestAuth/require-header'));

    // Environment configuration
    await fastify.register(require('@fastify/env'), {
        confKey: 'config',
        schema: {
            type: 'object',
            required: ['PG_DB', 'PG_USER', 'PG_PASS', 'PG_HOST', 'PG_PORT'],
            properties: {
                MAIN_DB_DIALECT: { type: 'string' },
                PG_DB: { type: 'string' },
                PG_USER: { type: 'string' },
                PG_PASS: { type: 'string' },
                PG_HOST: { type: 'string' },
                PG_PORT: { type: 'number' }
            }
        },
        dotenv: true,
        data: process.env
    });

    // PostgreSQL's connection and models   Important: YOU MUST RUN AND CONNECT POSTGRESS DB 
    
        await fastify.register(require('../../system/plugins/postgres/ps-db-connector'));
    

    //Resister redis plugin
    if(process.env.REDIS_IN_USE == "true"){  // redis is controlled from here 
        await fastify.register(require('../../system/plugins/redis/redis'));
    }


    

    // Registering ALL Routes (following pattern api/module-name/module-version) example api/user/v1
    const RouteFactory = require('../../system/core/routing/route-factory'); 
    await new RouteFactory(fastify).loadModules(path.join(__dirname, '../../modules'));



    // Security plugins
    await fastify.register(require('@fastify/helmet'));
    await fastify.register(require('@fastify/cors'), {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    });

    await fastify.register(require('@fastify/rate-limit'), {
        max: 100,
        timeWindow: '1 minute'
    });

    // Logging hooks
    fastify.addHook('onRequest', (request, reply, done) => {
        _sys.logger.inReq(`Incoming: ${request.method} ${request.url}`);
        done();
    });

    fastify.addHook('onResponse', (req, reply, done) => {

        _sys.logger.inReq('---------- > Request completed < ---------- ');
        done();
    });

    fastify.addHook('onRoute', (routeOptions) => {
        //_sys.logger.always(`Registered Route: ${routeOptions.method} ${routeOptions.path}`);
    });
    await fastify.ready();



    return fastify;

}

module.exports = { bootstrapApp };
