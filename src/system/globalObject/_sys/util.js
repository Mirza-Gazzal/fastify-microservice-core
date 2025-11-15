// src/system/globalObject/_sys/util.js
module.exports = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    fileExists: (fsPath) => require('fs').promises.access(fsPath).then(() => true).catch(() => false),

};
