import { LabelExtractor } from '../src/types/loggerConfig';
import * as winston from 'winston';
import * as loggerConfig from './config/logger';

const consoleLoggerMock = {
    log: jest.fn()
};
/* tslint:disable: only-arrow-functions object-literal-shorthand */

class Console extends winston.transports.Console {
    public log = consoleLoggerMock.log;
}

// @ts-ignore
winston.transports = {Console};

describe('Console logger', () => {
    let logger: any;

    beforeEach(async () => {
        consoleLoggerMock.log.mockClear();
        const loggerBuilder = (await import ('../src/logger')).default;
        const loggerInstance = loggerBuilder(loggerConfig);
        logger = loggerInstance(module);
    });
    test('level to be defined', () => {
        expect(logger.error).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.verbose).toBeDefined();
        expect(logger.debug).toBeDefined();
        expect(logger.silly).toBeDefined();
    });
    test('expect string to pass', () => {
        // arrange
        // act
        logger.info('foo');
        // assert
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringMatching('foo')
                }),
                expect.anything());
    });
    test('object passed', () => {
        logger.info({foo: 'bar'});
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringMatching('{ foo: \'bar\' }')
                }),
                expect.anything());
    });
    test('many params', () => {
        logger.info(' this', 'is many', 'params', 'passed', 'to', 'logger');
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringMatching(' this is many params passed to logger')
                }),
                expect.anything()
        );
    });
    test('two params', () => {
        logger.warn('this', 'error');
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.objectContaining({
                    level: expect.stringMatching('warn'),
                    message: expect.stringMatching('this error')
                }),
                expect.anything()
        );
    });
    test('many params with objects', () => {
        logger.info(' this', 'is many', {foo: 'bar'}, 'passed', 2, 'logger');
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringMatching(' this is many { foo: \'bar\' } passed 2 logger')
                }),
                expect.anything()
        );
    });
    test('expect error to be handled', () => {
        logger.error(new Error('foo'));
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.objectContaining({
                    message: expect.stringMatching('foo'),
                    stack: expect.anything()
                }),
                 expect.anything());
    });
});
describe('label-extractors', () => {
    beforeEach(() => {
        consoleLoggerMock.log.mockClear();
    });
    test('extractsFile', async () => {
        const loggerBuilder = (await import ('../src/logger')).default;
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            }
        });
        const logger = loggerInstance(module);
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    label: expect.stringMatching(/test\/logger.test.[j|t]s/)
                }), expect.anything());
    });
    test('Given moleculer extractor - extract module', async () => {
        const loggerBuilder = (await import ('../src/logger')).default;
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            },
            labelExtractors: [LabelExtractor.moleculer]
        });
        const logger = loggerInstance({nodeID: 'node1', ns: 'space', mod: 'broker'});
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                expect.objectContaining({
                    label: 'node1:space:broker'
                }), expect.anything());
    });
    test('Given no moleculer extractor - extract empty', async () => {
        const loggerBuilder = (await import ('../src/logger')).default;
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            }
        });
        const logger = loggerInstance({nodeID: 'node1', ns: 'space', mod: 'broker'});
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(
                 expect.objectContaining({
                    label: ''
                }), expect.anything());
    });
});
