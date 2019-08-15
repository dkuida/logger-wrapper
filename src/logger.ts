import * as winston from 'winston';
import * as path from 'path';

import { LabelExtractor, LoggerConfig } from './types/loggerConfig';
import { Loggable, MoleculerMeta } from './types/MoleculerMeta';
import Module = NodeJS.Module;

const {createLogger, transports, format} = winston;
const {combine, timestamp, label, metadata, errors, simple, colorize} = format;

const getLabel = (labelObject: Loggable, labelExtractors: LabelExtractor[]): string => {
    try {
        if (!labelObject){
            return '';
        }
        if (labelObject.hasOwnProperty('filename')) {
            const parts = (labelObject as Module).filename.split(path.sep);
            return parts[parts.length - 2] + '/' + parts.pop();
        }
        if (labelExtractors.indexOf(LabelExtractor.moleculer) > -1
                && labelObject.hasOwnProperty('nodeID')
                && labelObject.hasOwnProperty('ns')
                && labelObject.hasOwnProperty('mod')
        ) {
            const nodeMeta = labelObject as MoleculerMeta;
            return `${nodeMeta.nodeID}:${nodeMeta.ns}:${nodeMeta.mod}`;
        }
        return '';
    } catch (e) {
        return '';
    }
};

function buildLogger(config: LoggerConfig, instanceLabel: string): winston.Logger {
    const transportsProviders = [];
    if (config.console) {
        const consoleConfig = config.console;
        transportsProviders.push(new transports.Console({
            format: combine(
                    colorize({all: true}),
                    timestamp(),
                    label({label: instanceLabel}),
                    errors({stack: true}),
                    simple()
            ),
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
        const transport = require('@dkuida/winston-logstash');
        const logstashTransport = transport.default;
        transportsProviders.push(new logstashTransport({
            handleExceptions: loggerConfig.handleExceptions !== false,
            host: loggerConfig.host,
            label: config.service,
            level: loggerConfig.level,
            node_name: loggerConfig.nodeName,
            port: loggerConfig.port
        }));
    }
    if (config.fluentd){
        const fluentLib = require('fluent-logger');
        const fluentTransport = fluentLib.support.winstonTransport();
        const fluent = new fluentTransport(instanceLabel, {...config.fluentd!,  requireAckResponse: true });
        transportsProviders.push(fluent);
    }
    return createLogger({
        exitOnError: false,
        format: combine(
                timestamp(),
                // splat(),
                label({label: instanceLabel}),
                metadata(),
                errors({stack: true})
        ),
        transports: transportsProviders
    });
}

function getLogger(invokingModule: Loggable, config: LoggerConfig): winston.Logger {
    const instanceLabel = getLabel(invokingModule, config.labelExtractors || []);
    return buildLogger(config, instanceLabel);
}

const logger = (config: any) => (module: Loggable) => {
    if (!config.service) {
        config.service = 'Service name not defined in log config';
    }
    return getLogger(module, config);
};

export default logger;
