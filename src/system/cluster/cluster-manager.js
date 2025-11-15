const cluster = require('cluster');
process.removeAllListeners('warning'); // can remove any time used to jujst hide outdated mpn packages warnings remove and update if needed
if (cluster.isPrimary) {
    require('./primary');
} else {
    require('./worker');
}
