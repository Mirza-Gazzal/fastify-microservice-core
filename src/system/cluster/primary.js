require('dotenv').config();
const cluster = require('cluster');
const net = require('net');
const os = require('os');
const { HTTPParser } = require('http-parser-js');
const {
    forkCount,
    forkDelay,
    restartDelay,
    restartDead,
    port
} = _sys.config.cluster;

const totalCPUs = os.cpus().length;
const workersToFork = forkCount === 'auto' ? totalCPUs : parseInt(forkCount) || totalCPUs;

let currentWorkerIndex = 0;
const workers = [];


_sys.logger.log('environment : '+ process.env.NODE_ENV + ' | isLocal:' + process.env.isLocal + ' | isProd:' + process.env.isProd );




const server = net.createServer({ pauseOnConnect: true }, (connection) => {



    const remoteIP = connection.remoteAddress;
    const workerIndex = ipToWorkerIndex(remoteIP, workers.length);
    const worker = workers[workerIndex];

    //  const worker = workers[currentWorkerIndex];
    currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;

    worker.send('sticky-session:connection', connection)




});
function ipToWorkerIndex(ip, totalWorkers) { // add to test nginx sticky-session connection code
    const hash = ip.split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % totalWorkers;
}


server.listen(_sys.config.port || 3000, '127.0.0.1' ,() => {
    const address = server.address();

    _sys.logger.log("PRIMARY SERVER RUNNING:" , address.address +':'+address.port); // http://localhost:${fastify.server.address().port}


});


cluster.on('exit', async (worker, code) => {
    const idx = workers.indexOf(worker);
    if (idx > -1) workers.splice(idx, 1);

    if (!restartDead) return;
    _sys.logger.error(`Worker ${worker.process.pid} died. Restarting...`);
    await _sys.util.sleep(restartDelay);
    const newWorker = cluster.fork();
    workers.push(newWorker);
    attachWorkerListeners(newWorker);
});

(async () => {
    for (let i = 0; i < workersToFork; i++) {
        const worker = cluster.fork();
        workers.push(worker);
        attachWorkerListeners(worker);

        if (i < workersToFork - 1) await _sys.util.sleep(forkDelay); // very important for smooth forking
    }
    _sys.logger.log(` ${workersToFork} workers is running ...`);
    _sys.logger.log(`Primary Process Completed Children Forking `);
})();

function attachWorkerListeners(worker) {
    worker.on('message', (msg) => {
        if (msg.type === 'heartbeat') {
          

        } else if (msg.type === 'scale-up') {
            const newWorker = cluster.fork();
            workers.push(newWorker);
            attachWorkerListeners(newWorker);
            _sys.logger.always('Worker scaled up');
        } else if (msg.type === 'scale-down' && workers.length > 1) {
            const victim = workers.pop();
            victim.kill();
            _sys.logger.always('Worker scaled down');
        }
    });




}
