const repositoryFactory = require('../repositories');
const serviceFactory = require('../services');
const controllerFactory = require('../controllers');
const validator = require('../validators');
const sanitizer = require('../sanitizers');

module.exports = async function (fastify, opts) {
    const UserModel = fastify.db.models['User'];

    if (!UserModel) {
        fastify.log.error('❌ User model not found in db.models');
        throw new Error('User model not foundzzzzzz');
    }

    const repository = repositoryFactory(UserModel);
    const service = serviceFactory(repository);
    const controller = controllerFactory(service);

    fastify.post('/add', {
        preValidation: [sanitizer.create, validator.create],  // add the validations on the incoming data on this route
        handler: controller.create, // calling the needed method from the controller
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

    fastify.post('/otp/request',{
        preValidation: [sanitizer.generateOTP, validator.generateOTP],
        handler: controller.generateOTP
    });

    fastify.post('/otp/verify',{
        preValidation: [sanitizer.verifyOTP, validator.verifyOTP],
        handler: controller.verifyOTP
    });
  fastify.get('/stripe/info',{
     //   preValidation: [sanitizer.verifyOTP, validator.verifyOTP],
        handler: controller.getStripe
    });

    fastify.get('/ws', { websocket: true }, (conn, req) => {
        const ws = conn.socket;
        ws.send(`👋 Hello from PID ${process.pid}`);
        ws.on('message', msg => ws.send(`↩ Echo: ${process.pid}  ${msg}`));
    });



    // Stripe webhook route
    // Raw body parser for signature verification
    fastify.addContentTypeParser(
        'application/json',
        { parseAs: 'buffer' },
        (req, body, done) => done(null, body)
    );
    fastify.post('/webhook',{


            handler: controller.handleWebhook
    }


    );



};
