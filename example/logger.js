const logger = require('../src/logger');
const loggerConfig = require('./config/logger');
const loggerInstance = logger(loggerConfig);

module.exports = loggerInstance;
