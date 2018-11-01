'use strict';

const proxyquire = require('proxyquire');

const loggerMock = jasmine.createSpyObj('logger', ['debug', 'fatal', 'info', 'log']);
const winstonMock = {
    createLogger: function () {
        return loggerMock;
    }
};
const loggerBuilder = proxyquire('../bin/logger', {
    'winston': winstonMock
});
const loggerConfig = require('./config/logger');
const loggerInstance = loggerBuilder(loggerConfig);

const logger = loggerInstance(module);


describe('Logger Required', function () {
    beforeEach(() => {
        loggerMock.log.calls.reset();
    });
    it('expect logger called', function () {
        /**arrange*/
        /**act*/
        logger.info('HELLO');
        /**assert*/
        expect(loggerMock.log).toHaveBeenCalled();
        expect(loggerMock.log).toHaveBeenCalledWith('info', jasmine.anything(), jasmine.anything());
    });
    it('', function () {
        /**arrange*/
        /**act*/
        logger.fatal('FATAL');
        /**assert*/
        expect(loggerMock.log).toHaveBeenCalled();
        expect(loggerMock.log).toHaveBeenCalledWith('fatal', jasmine.anything(), jasmine.anything());
    });
});
