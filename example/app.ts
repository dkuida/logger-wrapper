import loggerInstance from './logger';

const logger = loggerInstance(module);
logger.debug('debug message');
logger.info('info message');
logger.warn('warn message');
logger.error('error message');
