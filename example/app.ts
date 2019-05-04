import loggerInstance from './logger';

const logger = loggerInstance(module);
logger.info('HELLO');
logger.error('FATAL');
