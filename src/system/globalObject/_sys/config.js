// src/system/globalObject/_sys/config.js
module.exports = {
    cluster: {
        forkCount: process.env.SYSTEM_CLUSTER_FORK || 'auto',
        forkDelay: parseInt(process.env.SYSTEM_CLUSTER_FORK_DELAY) || 1000,
        restartDelay: parseInt(process.env.SYSTEM_CLUSTER_WORKER_RESTARTING_DELAY) || 2000,
        restartDead: process.env.SYSTEM_CLUSTER_WORKER_RESTART !== 'no',
        port: process.env.SYSTEM_TCP_SERVER_PORT
    },
   /* cors: { // for production environment
        origins: (process.env.CORS_ORIGINS || "").split(",").map(u => u.trim()).filter(Boolean),
    },*/
};
