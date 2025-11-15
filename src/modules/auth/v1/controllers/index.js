

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
            try{

                const result = await service.create(req.body);


                return reply.respond().created(result,'User created')
            }
           catch (err){
               if (err.code === 'DUPLICATE_EMAIL') {
                   return reply.respond().clientError('Email already in use' );
               }
               else{
                   return  reply.respond().clientError('Error in user create controller Error :' + err);
               }
           }
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

        async login(req,reply){

            try{
                const result =  await service.login(req.body,req)
                return reply.respond().success(result,"login successful");
            }
            catch (err){
                if (err.code === 'INVALID_CREDENTIALS') {
                    return reply.respond().clientError('Email or password are wrong' );
                }

            }



        },

        async refreshToken(req,reply){

            try{
                const result =  await service.refreshToken(req.body,req)
                return reply.respond().success(result,"refresh token successful renewed");
            }
            catch (err){

                return reply.respond().clientError('Invalid or expired refresh token' );



            }

            },

        async logout(req,reply){
            const result =  await service.logout(req.body,req)
            return reply.respond().success(result,"Logged Out ");

        }

        }



    };


module.exports = UserController;
