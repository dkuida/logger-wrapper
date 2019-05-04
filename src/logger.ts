import * as winston from 'winston';
console.log(winston)
import LogzioWinstonTransport from 'winston-logzio';

import * as path from 'path';

// import {LogstashTransport} from 'winston-logstash-transport';
import {LoggerConfig} from './loggerConfig';
import Module = NodeJS.Module;
import {Logger} from 'winston';

const {createLogger, transports, format, addColors} = winston;
console.log(format)
const {combine, timestamp, label, prettyPrint} = format;

const getLabel = function (labelObject) {
    if (labelObject && labelObject.hasOwnProperty('filename')) {
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


function buildLogger(config: LoggerConfig): Logger {
    const transportsProviders = [];
    if (config.file) {
        const fileConfig = config.file;
        transportsProviders.push(new transports.File({
            level: <any>fileConfig.level,
            filename: fileConfig.path,
            maxsize: fileConfig.maxSize, //5242880, //5MB
            maxFiles: fileConfig.maxFiles
        }));
    }
    if (config.console) {
        const consoleConfig = config.console;
        addColors(levelsCustom.colors);
        transportsProviders.push(new transports.Console({
            level: <any>consoleConfig.level
        }));
    }
    if (config.logzio) {
        const logzioConfig = config.logzio;
        transportsProviders.push(new LogzioWinstonTransport({
            level: <any>logzioConfig.level,
            timestamp: true,
            type: logzioConfig.level,
            token: logzioConfig.token,
            host: logzioConfig.host
        }));
    }
    // if (config.logstashudp) {
    //     const loggerConfig = config.logstashudp;
    //     transportsProviders.push(new LogstashTransport({
    //         label: config.service,
    //         timestamp: true,
    //         level: loggerConfig.level,
    //         port: loggerConfig.port,
    //         node_name: loggerConfig.nodeName,
    //         host: loggerConfig.host,
    //         json: true
    //     }));
    // }
    return createLogger({
        format: combine(
                label({label: config.service}),
                timestamp(),
                prettyPrint()
        ),
        transports: transportsProviders,
        exitOnError: false
    });
}

function writeLog(logger: Logger, level, originalMessage, meta) {
    if (typeof originalMessage===Error || (originalMessage && originalMessage.hasOwnProperty('stack'))) {
        const allInfo = winston.exceptions.getAllInfo(originalMessage);
        logger.log(level, allInfo, meta);
        return allInfo;
    } else {
        const textMessage = typeof originalMessage===Object ? JSON.stringify(originalMessage):originalMessage;
        logger.log(level, textMessage, meta);
        return originalMessage;
    }
}

function getLogger(invokingModule: Module, config: LoggerConfig) {
    const logger = buildLogger(config);
    console.log(logger.log)
    const fileName = getLabel(invokingModule);
    const wrappedLogger = {};
    ['debug', 'info', 'warn', 'error', 'fatal'].forEach(level => {
        wrappedLogger[level] = (textLog, userMeta) => {
            let meta = {invocationLocation: fileName};
            if ((typeof userMeta)==='object') {
                meta = Object.assign(meta, userMeta);
            }
            return writeLog(logger, level, textLog, meta);
        };
    });
    return wrappedLogger;
}

const logger = (config: any) => (module: any) => {
    config.service = config.hasOwnProperty('service') ? config.service:
            'Service name not defined in log config';
    module.project = config.service;
    return getLogger(module, config);
};


export default logger;
