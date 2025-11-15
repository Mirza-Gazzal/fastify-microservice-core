// dynamic logging controller that allows you to controll all 
// logging in the core and give you the ablity to control your DEV logging and Prod logging in a very easy and simple way

// you can add coloring for you logging type to make ease will log tracking

const cluster = require('cluster');

// Controls
const isPrimary = cluster.isPrimary;
const isWorker = cluster.isWorker;
const workerId = cluster.worker?.id;
const isLogLeader = isPrimary || workerId === 1;

function prefix(level) {
    return isPrimary ? '[+]' : `[-] W${workerId}`;
}

module.exports = {
    log: (...args) => {
        if (isLogLeader) console.log(prefix('info'), ...args);
    },
    warn: (...args) => {
        if (isLogLeader) console.warn(prefix('warn'), ...args);
    },
    error: (...args) => {
        if (isLogLeader) console.error(prefix('error'), ...args);
    },
    always: (...args) => {
        // Logs from all workers regardless
        console.log(prefix('info'), ...args);
    },
    inReq: (...args) => {
        // Logs from all workers regardless and only in DEV mode
        if(process.env.NODE_ENV == "DEV"){ // ENV logging control
            console.log('\x1b[34m',prefix('info'), ...args); // blue logging to easy catch your workers logs
        }

    },
    silent: (...args) => {
        // Useful for no-op replacement \x1b[32m
    },
    whoami: () => {
        return isPrimary ? 'Primary' : `Worker-${workerId}`;
    },
    isPrimary,
    isWorker,
    isLogLeader,
    workerId
};


/*
log coloring

\x1b[31m = red

\x1b[32m = green

\x1b[33m = yellow

\x1b[34m = blue

\x1b[36m = cyan

\x1b[0m = reset color
*/
