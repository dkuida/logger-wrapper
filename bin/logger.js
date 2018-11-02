const winston = require('winston');
const { createLogger, transports, format } = winston;
const Transport = require('winston-transport');
const LogzioWinstonTransport = require('winston-logzio');
const path = require('path');
const {LogstashTransport} = require('winston-logstash-transport');

const getLabel = function (labelObject) {
    if (labelObject.hasOwnProperty('filename')) {
        const parts = labelObject.filename.split(path.sep);
        return parts[parts.length - 2] + '/' + parts.pop();
    }
    return labelObject;
};

const levelsCustom = {
    colors: {
        fatal: 'red',
        error: 'magenta',
        warn: 'grey',
        info: 'green',
        debug: 'blue'
    }
};

winston.addColors(levelsCustom.colors);

function buildLogger (config) {
    const transportsProviders = [];
    if (config.hasOwnProperty('file')) {
        transportsProviders.push(new transports.File({
            label: config.service,
            level: config.file.level,
            timestamp: true,
            filename: process.env.LOGGER_FILE_PATH || config.file.path,
            json: false,
            maxsize: process.env.LOGGER_FILE_MAX_SIZE || config.file.maxSize, //5242880, //5MB
            maxFiles: process.env.LOGGER_FILE_MAX_FILES || config.file.maxFiles,
            colorize: false
        }));
    }
    if (config.hasOwnProperty('console')) {
        transportsProviders.push(new transports.Console({
            level: config.console.level,
            timestamp: true,
            silent: false,
            label: config.service,
            prettyPrint: true,
            json: false,
            colorize: true
        }));
    }
    if (config.hasOwnProperty('logzio')) {
        transportsProviders.push(new LogzioWinstonTransport({
            label: config.service,
            timestamp: true,
            level: config.logzio.level,
            type: config.logzio.level,
            token: config.logzio.token,
            host: config.logzio.host
        }));
    }
    if (config.hasOwnProperty('logstashudp')) {
        const loggerConfig = config.logstashudp;
        transportsProviders.push(new LogstashTransport({
            label: config.service,
            timestamp: true,
            level: loggerConfig.level,
            port: loggerConfig.port,
            node_name: loggerConfig.nodeName,
            host: loggerConfig.host,
            json: true
        }));
    }
    return winston.createLogger({
        transports: transportsProviders,
        exitOnError: false
    });
}

function writeLog (logger, level, originalMessage, meta) {
    if (typeof originalMessage === Error || originalMessage.hasOwnProperty('stack')) {
        const allInfo = winston.exception.getAllInfo(originalMessage);
        logger.log(level, allInfo, meta);
        return allInfo;
    } else {
        const textMessage = typeof originalMessage === Object ? JSON.stringify(originalMessage) : originalMessage;
        logger.log(level, textMessage, meta);
        return originalMessage;
    }
}

function getLogger (invokingModule, config) {
    const logger = buildLogger(config);
    const fileName = getLabel(invokingModule);
    const wrappedLogger = {};
    ['debug', 'info', 'warn', 'error', 'fatal'].forEach(level => {
        wrappedLogger[level] = (textLog, userMeta) => {
            let meta = {file: fileName};
            if (typeof userMeta === Object) {
                meta = Object.assign(meta, userMeta);
            }
            return writeLog(logger, level, textLog, meta);
        };
    });
    return wrappedLogger;
}

module.exports = config => module => {
    config.service = config.hasOwnProperty('service') ? config.service :
        'Service name not defined in log config';
    module.project = config.service;
    return getLogger(module, config);
};
