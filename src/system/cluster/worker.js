const net = require('net');
const { bootstrapApp } = require('./worker-app');

// Create a local TCP server for this worker (will never bind to a public port)
const server = net.createServer({ pauseOnConnect: true });



(async () => {
    const fastify = await bootstrapApp(server);

    await fastify.ready();

    // Attach incoming connections to Fastify
    process.on('message', (msg, socket) => {
        if (msg === 'sticky-session:connection' && socket) {
            fastify.server.emit('connection', socket);
            socket.resume();
        }
    });


        _sys.logger.log(`Worker ${process.pid} ready and listening via sticky session`);


    setInterval(() => {
        process.send && process.send({ type: 'heartbeat' });
    }, 5000); // 30_000 for 30 seconds
})();