import loggerInstance from './logger';

const logger = loggerInstance(module);
setTimeout(() => {
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

}, 10000);
