// src/system/globalObject/_sys/index.js
const path = require('path');
const config = require('./config');
const util = require('./util');
const logger = require('./logger');

global._sys = {
    config ,
    util,
    logger,
    path: {
        base: path.resolve(__dirname, '../../../..'),
        lifecycle: path.resolve(__dirname, '../../../lifecycle'),
        bootstrap: path.resolve(__dirname, '../../../bootstrap')
    }
};
