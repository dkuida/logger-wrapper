import logger from '../src/logger';

import * as loggerConfig from './config/logger';

const loggerInstance = logger(loggerConfig);

export default loggerInstance;
