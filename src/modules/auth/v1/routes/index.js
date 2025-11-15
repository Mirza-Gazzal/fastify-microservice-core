const repositoryFactory = require('../repositories');
const serviceFactory = require('../services');
const controllerFactory = require('../controllers');
const validator = require('../validators');
const sanitizer = require('../sanitizers');

module.exports = async function (fastify, opts) {
    const AuthModel = fastify.db.models['auth-user'];

    if (!AuthModel) { // flags a error when ever there is DB connection error or wrong/missing  model 
        fastify.log.error(' Auth model not found in db.models');
        throw new Error('Auth model not found');
    }

    const repository = repositoryFactory(AuthModel);
    const service = serviceFactory(repository);
    const controller = controllerFactory(service);

    fastify.post('/create', {
      //  preValidation: [sanitizer.create, validator.create],  // add the validations on the incoming data on this route
        handler: controller.create, // calling the needed method from the controller
    });

    fastify.post('/login', {
        //  preValidation: [sanitizer.create, validator.create],  // add the validations on the incoming data on this route
        handler: controller.login, // calling the needed method from the controller
    });


    fastify.post('/refresh', {
        //  preValidation: [sanitizer.create, validator.create],  // add the validations on the incoming data on this route
        handler: controller.refreshToken, // calling the needed method from the controller
    });

    fastify.post('/logout', {
        //  preValidation: [sanitizer.create, validator.create],  // add the validations on the incoming data on this route
        handler: controller.refreshToken, // calling the needed method from the controller
    });

    // List users
    fastify.get('/list', {
        preValidation: [sanitizer.list, validator.list],
        handler: controller.list,
    });


// sticky session teat
    fastify.get('/debug/pid', async (request, reply) => {
       // reply.header('Connection', 'close'); // closes the tcp connection for testing
        return {
            pid: process.pid,
            time: new Date().toISOString(),
        };
    });
    // Get user by ID
    fastify.get('/:id', {
        preValidation: [sanitizer.get, validator.get],
        handler: controller.get,
    });

    // Update user by ID
    fastify.put('/:id', {
        preValidation: [sanitizer.update, validator.update],
        handler: controller.update,
    });


    // Delete user by ID
    fastify.delete('/:id', {
        preValidation: [sanitizer.get, validator.get],
        handler: controller.delete,
    });

    //search by letter on name filed
    fastify.get('/search/by-name', {
        preValidation: [sanitizer.searchByName, validator.searchByName],
        handler: controller.searchByName
    });








};
