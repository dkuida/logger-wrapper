import * as winston from 'winston';
import {Logger} from 'winston';

import * as path from 'path';
import {LogstashTransport} from 'winston-logstash';
import {LoggerConfig} from './loggerConfig';
import Module = NodeJS.Module;

const {createLogger, transports, format} = winston;
const {combine, timestamp, label, prettyPrint, errors, json, colorize} = format;

const getLabel = function (labelObject: Module): string {
    try {
        if (labelObject && labelObject.hasOwnProperty('filename')) {
            const parts = labelObject.filename.split(path.sep);
            return parts[parts.length - 2] + '/' + parts.pop();
        }
        return 'failed to get filename';
    } catch (e) {
        return 'failed to get filename';
    }
};

function buildLogger(config: LoggerConfig, fileName: string): winston.Logger {
    const transportsProviders = [];
    if (config.console) {
        const consoleConfig = config.console;
        transportsProviders.push(new transports.Console({
            level: <any>consoleConfig.level
        }));
    }
    if (config.file) {
        const fileConfig = config.file;
        transportsProviders.push(new transports.File({
            level: <any>fileConfig.level,
            filename: fileConfig.path,
            maxsize: fileConfig.maxSize, //5242880, //5MB
            maxFiles: fileConfig.maxFiles
        }));
    }
    if (config.logstash) {
        const loggerConfig = config.logstash;
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
    return createLogger({
        format: combine(
                label({label: fileName, message: true}),
                errors({ stack: true }),
                colorize(),
                timestamp(),
                prettyPrint(),
                json()
        ),
        transports: transportsProviders,
        exitOnError: false
    });
}


function getLogger(invokingModule: Module, config: LoggerConfig): Logger {
    const fileName = getLabel(invokingModule);
    return buildLogger(config, fileName);
}

const logger = (config: any) => (module: Module) => {
    if (!config.service) {
        config.service = 'Service name not defined in log config';
    }
    return getLogger(module, config);
};


export default logger;
