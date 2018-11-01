const logger = require('../bin/logger');
const loggerConfig = require('./config/logger');
const loggerInstance = logger(loggerConfig);

module.exports = loggerInstance;
