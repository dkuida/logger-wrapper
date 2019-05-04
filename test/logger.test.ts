/* tslint:disable: only-arrow-functions object-literal-shorthand */
const transportsMock = {
    Console: function() {
        return consoleLoggerMock;
    }
};
/* tslint:enable: only-arrow-functions object-literal-shorthand */
import * as winston from 'winston';
import * as loggerConfig from './config/logger';

const consoleLoggerMock = {
    log: jest.fn(),
    on: jest.fn()
};

// @ts-ignore
winston.transports = transportsMock;
import loggerBuilder from '../src/logger';

const loggerInstance = loggerBuilder(loggerConfig);

const logger = loggerInstance(module);

describe('Console logger', () => {
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
        // arrange
        // act
        logger.info('HELLO');
        // assert
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', expect.stringContaining('HELLO'),
                expect.anything(), expect.anything());
    });
    it('object passed', () => {
        // arrange
        // act
        logger.info('%o', {foo: 'bar'});
        // assert
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', expect.stringContaining('{ foo: \'bar\' }'),
                expect.anything(), expect.anything());
    });
    it('expect error to be handled', () => {
        logger.error(new Error('foo'));
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('error', expect.stringContaining('foo'),
                expect.objectContaining({
                    stack: expect.anything()
                }), expect.anything());
    });
});
