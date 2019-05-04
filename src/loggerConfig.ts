export enum LogLevel {
    error =  'error',
    warn =  'warn',
    info =  'info',
    verbose = 'verbose',
    debug =  'debug',
    silly =  'silly'
};

interface LoggerRequiredProps {
    level: LogLevel;
}

interface FileLoggerConfig extends LoggerRequiredProps{
    maxFiles: number;
    maxSize: number;
    path: string;

}
interface ConsoleLoggerConfig extends LoggerRequiredProps{

}
interface LogzioLoggerConfig extends LoggerRequiredProps{
    host: string;
    token: string;

}
interface LogstashUdpLoggerConfig extends LoggerRequiredProps{
    host: string;
    nodeName: string;
    port: number;

}
interface LogstashTcpLoggerConfig extends LoggerRequiredProps{

}

export interface LoggerConfig {
    service?: string;
    local?: boolean;
    console?: ConsoleLoggerConfig;
    file?: FileLoggerConfig;
    logstash?: LogstashTcpLoggerConfig;
    logstashudp?: LogstashUdpLoggerConfig;
    logzio?: LogzioLoggerConfig;
}
