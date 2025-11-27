# fastify-microservice-core

for setup please read (readme file below )

After setup and running  ....


follow the module demo logic for more understanding on how to crrate your own module and create the apis 


every module have a name exp: user

under user name you will find v1 under v1
0-controller (where we setup the return logic ad some validations if needed)
1-models (DB schema)
2-repositories (where you add DBand query logic)
3- routes (where you add your api route example : /user/login
4-sanitizer ( where you can write youe own sanitization logic)
5-service (where you add the web logic as we name )
6- validators (where you add validation layer for your incoming data before it hits your api logic)

I had add and provided some ready to use modules (auth it includes oAuth2 login protocal) and user basic create and login logic
