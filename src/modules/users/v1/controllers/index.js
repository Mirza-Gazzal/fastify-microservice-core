const stripe = require('../stripeClient');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


function UserController(service) {
    return {
        list: async (req, reply) => {
            const results = await service.list(req.query); //


            return reply.respond().fetched(results, 'Users retrieved');
        },

        get: async (req, reply) => {
            const result = await service.get(req.params.id);
          //  return result;
            return reply.respond().fetched(result, 'User retrieved');
        },

        create: async (req, reply) => {
            const result = await service.create(req.body);
          //  reply.code(201);
           // return result;
            return reply.respond().created(result,'User created')
        },

        update: async (req, reply) => {
            const result = await service.update(req.params.id, req.body);
            return reply.respond().updated(result,"user updated");
        },

        delete: async (req, reply) => {
            await service.delete(req.params.id);
            return reply.respond().deleted('User deleted');
        },

        async searchByName(request, reply) {
            const result = await service.searchByName(request.query.name);
            return reply.respond().success(result,"fetching success");
        },

        async generateOTP(req, reply) {

            const result = await service.generateOTP(req,reply);
            return reply.respond().created(result , 'OTP generated')
        },


        async verifyOTP(req, reply) {
         return await service.verifyOTP(req,reply);
        } ,

        async getStripe(req, reply) {
        //    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
         return await service.stripeTest(req,reply,stripe);
        },

        async  handleWebhook(req, reply) {
            console.log('webhook 1')

            const sig = req.headers['stripe-signature']
            let event

            try {
                // req.body is a Buffer thanks to the parser override
               event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_LOCAL);
                //event = req.body;
                const result = await service.processStripeEvent(event,stripe);
                return reply.respond().success(result,"fetching success");
            } catch (err) {
                req.log.error('⚠️ Webhook signature verification failed:', err.message)
                return reply.code(400).send({ error: 'Invalid signature' })
            }

        }



    };
}

module.exports = UserController;
