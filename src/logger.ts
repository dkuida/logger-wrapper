import * as winston from 'winston';
import * as path from 'path';
import {LogstashTransport} from 'dkuida-winston-logstash';
import {LoggerConfig} from './loggerConfig';
import Module = NodeJS.Module;

const {createLogger, transports, format} = winston;
const {combine, timestamp, label,  errors, json, colorize, splat} = format;

const getLabel = (labelObject: Module): string => {
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
            handleExceptions: consoleConfig.handleExceptions !== false,
            level: <any> consoleConfig.level
        }));
    }
    if (config.file) {
        const fileConfig = config.file;
        transportsProviders.push(new transports.File({
            filename: fileConfig.path,
            handleExceptions: fileConfig.handleExceptions !== false,
            level: <any> fileConfig.level,
            maxFiles: fileConfig.maxFiles,
            maxsize: fileConfig.maxSize
        }));
    }
    if (config.logstash) {
        const loggerConfig = config.logstash;
        transportsProviders.push(new LogstashTransport({
            handleExceptions: loggerConfig.handleExceptions !== false,
            host: loggerConfig.host,
            label: config.service,
            level: loggerConfig.level,
            node_name: loggerConfig.nodeName,
            port: loggerConfig.port
        }));
    }
    return createLogger({
        exitOnError: false,
        format: combine(
                label({label: fileName, message: true}),
                errors({stack: true}),
                colorize(),
                timestamp(),
                json(),
                splat()
        ),
        transports: transportsProviders
    });
}

function getLogger(invokingModule: Module, config: LoggerConfig): winston.Logger {
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
