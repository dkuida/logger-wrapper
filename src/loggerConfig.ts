export enum LogLevel {
    fatal =  'fatal',
    error =  'error',
    warn =  'warn',
    info =  'info',
    verbose = 'verbose',
    debug =  'debug',
    silly =  'silly'
}

interface LoggerCommonProps {
    level: LogLevel;
    handleExceptions?: boolean;
}

interface FileLoggerConfig extends LoggerCommonProps{
    maxFiles: number;
    maxSize: number;
    path: string;

}
// tslint:disable-next-line:no-empty-interface
interface ConsoleLoggerConfig extends LoggerCommonProps{

}
interface LogstashTcpLoggerConfig extends LoggerCommonProps{
    host: string;
    nodeName: string;
    port: number;
}

export interface LoggerConfig {
    service?: string;
    local?: boolean;
    console?: ConsoleLoggerConfig;
    file?: FileLoggerConfig;
    logstash?: LogstashTcpLoggerConfig;
}
