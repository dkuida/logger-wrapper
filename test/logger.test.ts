import * as winston from 'winston';
const loggerConfig = require('./config/logger');
// const loggerMock = {
//     log: jest.fn()
// };

const consoleLoggerMock = {
    log: jest.fn(),
    on : jest.fn()
};

const transportsMock = {
   Console: function () {
       return consoleLoggerMock;
   }
};

const winstonMock = {
    ...winston,
    transports: transportsMock
};
jest.mock('winston', () => (winstonMock));



import loggerBuilder from '../src/logger';


const loggerInstance = loggerBuilder(loggerConfig);


const logger = loggerInstance(module);


describe('Console logger', function () {
    beforeEach(() => {
        consoleLoggerMock.log.mockClear();
    });
    it('level to be defined', () => {
        expect(logger.error).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.verbose).toBeDefined();
        expect(logger.debug).toBeDefined();
        expect(logger.silly).toBeDefined();
    });
    it('expect logger called', () => {
        /**arrange*/
        /**act*/
        logger.info('HELLO');
        /**assert*/
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', '[test/logger.test.js] HELLO', expect.anything(), expect.anything());
    });
    it('expect error to be handled', () => {
        logger.error(new Error('foo'));
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('error', '[test/logger.test.js] foo', expect.objectContaining({
            stack: expect.anything()
        }), expect.anything());
    });
});
