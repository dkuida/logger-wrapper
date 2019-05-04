import * as winston from 'winston';
const loggerConfig = require('./config/logger');
const loggerMock = {
    log: jest.fn()
};
const winstonMock = {
    ...winston,
    createLogger: function () {
        return loggerMock;
    }
};
jest.mock('winston', () => (winstonMock));



import loggerBuilder from '../src/logger';


const loggerInstance = loggerBuilder(loggerConfig);


const logger = loggerInstance(module);


describe('Logger Required', function () {
    beforeEach(() => {
        loggerMock.log.mockClear();
    });
    it('expect logger called', function () {
        /**arrange*/
        /**act*/
        console.log(logger)
        logger.info('HELLO');
        /**assert*/
        expect(loggerMock.log).toHaveBeenCalled();
        expect(loggerMock.log).toHaveBeenCalledWith('info', expect.anything(), expect.anything());
    });
    it('', function () {
        /**arrange*/
        /**act*/
        logger.fatal('FATAL');
        /**assert*/
        expect(loggerMock.log).toHaveBeenCalled();
        expect(loggerMock.log).toHaveBeenCalledWith('fatal', expect.anything(), expect.anything());
    });
});
