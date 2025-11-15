

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

module.exports = (repository) => {
    return {
        list: async (query = {}) => {
            return repository.findAll(query);
        },
        create: async (data) => {
            const { email, password, first_name, last_name } = data;
            const hashedPassword = await bcrypt.hash(password, 10);

            const existing = await repository.findByEmail(email);

            if (existing) {
                const err = new Error('Email already exists');
                err.code = 'DUPLICATE_EMAIL';
                throw err;
            }

            return repository.create({ email, password :hashedPassword, first_name, last_name });
        },
        update: async (id, data) => {
            return repository.update(id, data);
        },
        delete: async (id) => {
            return repository.delete(id);
        },
        get: async (id) => {
            return repository.findById(id);
        },
        async  searchByName(name) {
            return repository.findByNameFragment(name);
        },


        async  login(data,req) {
           
            const { email, password } = data;

           const user = await repository.findByEmail(email);

            if (user == null) {
                const err = new Error('User not found');
                err.code = 'INVALID_CREDENTIALS';
                throw err;
            }


            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                const err = new Error('Password incorrect');
                err.code = 'INVALID_CREDENTIALS';
                throw err;
            }


            const accessToken = await req.server.jwt.sign({
                sub: user.id,
                email: user.email,
                scope: ['read:user', 'write:order'],
            });
            console.log("token---------------------------------:" +accessToken)

            //  Generate refresh token
            const refreshToken = uuidv4();
            const refreshKey = `refresh_token:${refreshToken}`;
            console.log("ref:   -------------"+refreshKey)


            await req.server.redis.set(refreshKey, user.id, 'EX', 7 * 24 * 60 * 60); // 7 days

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: 900, // 15 minutes

            };




        },


        async refreshToken(data,req){

            const  refreshToken = data.refresh_token
            const redisKey = `refresh_token:${refreshToken}`;


            // 1. Check Redis
            const userId = await req.server.redis.get(redisKey);

            if (!userId) {
                const err = new Error('Invalid or expired refresh token');
                err.code = 'INVALID_TOKEN';
                throw err;
            }

            // 2.  delete old token (to prevent reuse)
            await req.server.redis.del(redisKey);

            // 3. Fetch user info (or store more in redis for speed)
            console.log(userId)
           const user = await  repository.getUuidId(userId);


            // 4. Generate new access token
            const accessToken = req.server.jwt.sign({
                sub: user.id,
                email: user.email,
                scope: ['read:user', 'write:order'],
            });

            // 5. Generate and store new refresh token (rotated)
            const newRefreshToken = uuidv4();
            const newRedisKey = `refresh_token:${newRefreshToken}`;
            await req.server.redis.set(newRedisKey, user.id, 'EX', 7 * 24 * 60 * 60);


            return {
                access_token: accessToken,
                refresh_token: newRefreshToken,
                expires_in: 900,
            };

        },

        async logout(data,req){

            const  refreshToken = data.refresh_token
            const redisKey = `refresh_token:${refreshToken}`;

            await req.server.redis.del(redisKey);

        }





    };
};
