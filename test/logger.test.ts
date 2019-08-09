import { LabelExtractor } from '../src/loggerConfig';
import * as winston from 'winston';
/* tslint:disable: only-arrow-functions object-literal-shorthand */
const transportsMock = {
    Console: function() {
        return consoleLoggerMock;
    }
};
/* tslint:enable: only-arrow-functions object-literal-shorthand */
// @ts-ignore
winston.transports = transportsMock;

import * as loggerConfig from './config/logger';

import loggerBuilder from '../src/logger';

const consoleLoggerMock = {
    log: jest.fn(),
    on: jest.fn()
};

describe('Console logger', () => {
    const loggerInstance = loggerBuilder(loggerConfig);
    const logger = loggerInstance(module);

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
        logger.info('%o', {foo: 'bar'});
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
describe('label-extractors', () => {
    beforeEach(() => {
        consoleLoggerMock.log.mockClear();
    });
    test('extractsFile', () => {
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            }
        });
        const logger = loggerInstance(module);
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.anything(),
                expect.stringMatching(/\[test\/logger.test.[j|t]s\] foobar/), expect.anything(), expect.anything());
    });
    test('Given moleculer extractor - extract module', () => {
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            },
            labelExtractors: [LabelExtractor.moleculer]
        });
        const logger = loggerInstance({nodeID: 'node1', ns: 'space', mod: 'broker'});
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.anything(),
                '[node1:space:broker] foobar', expect.anything(), expect.anything());
    });
    test('Given no moleculer extractor - extract empty', () => {
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            }
        });
        const logger = loggerInstance({nodeID: 'node1', ns: 'space', mod: 'broker'});
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.anything(),
                '[] foobar', expect.anything(), expect.anything());
    });
});
