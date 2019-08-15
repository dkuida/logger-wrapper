import { LabelExtractor } from '../src/types/loggerConfig';
import * as winston from 'winston';
import * as loggerConfig from './config/logger';

/* tslint:disable: only-arrow-functions object-literal-shorthand */
const transportsMock = {
    Console: function() {
        return consoleLoggerMock;
    }
};
/* tslint:enable: only-arrow-functions object-literal-shorthand */
// @ts-ignore
winston.transports = transportsMock;

const consoleLoggerMock = {
    log: jest.fn(),
    on: jest.fn()
};
// import loggerBuilder from '../src/logger';
describe('Console logger', () => {
    // const loggerBuilder = (await import ('../src/logger')).default;
    // const loggerInstance = loggerBuilder(loggerConfig);
    let logger: any;// = loggerInstance(module);

    beforeEach(async () => {
        const loggerBuilder = (await import ('../src/logger')).default;
        const loggerInstance = loggerBuilder(loggerConfig);
        logger = loggerInstance(module);

        consoleLoggerMock.log.mockClear();
    });
    test('level to be defined', () => {
        expect(logger.error).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.verbose).toBeDefined();
        expect(logger.debug).toBeDefined();
        expect(logger.silly).toBeDefined();
    });
    test('expect logger called', () => {
        // arrange
        // act
        logger.info('HELLO');
        // assert
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', expect.stringContaining('HELLO'),
                expect.anything(), expect.anything());
    });
    test('object passed', () => {
        logger.info({foo: 'bar'});
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', {foo: 'bar'},
                expect.anything(), expect.anything());
    });
    test('many params', () => {
        logger.info(' this', 'is many', 'params', 'passed', 'to', 'logger');
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        const splatSymbol = Symbol('splat');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', ' this',
                expect.objectContaining({
                    [splatSymbol]: [
                        'is many',
                        'params',
                        'passed',
                        'to',
                        'logger',
                    ]
                }),
                expect.anything()
        );
    });
    test('many params', () => {
        logger.info(' this', ' error');
        expect(consoleLoggerMock.log).toHaveBeenCalledTimes(1);
        const splatSymbol = Symbol('splat');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith('info', ' this',
                expect.objectContaining({[splatSymbol]: [' error']}),
                expect.anything()
        );
    });
    test('expect error to be handled', () => {
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
    test('extractsFile', async () => {
        const loggerBuilder = (await import ('../src/logger')).default;
        const loggerInstance = loggerBuilder({
            console: {
                level: 'debug'
            }
        });
        const logger = loggerInstance(module);
        logger.warn('foobar');
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.anything(),
                'foobar', expect.objectContaining({
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
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.anything(),
                'foobar', expect.objectContaining({
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
        expect(consoleLoggerMock.log).toHaveBeenCalledWith(expect.anything(),
                'foobar', expect.objectContaining({
                    label: ''
                }), expect.anything());
    });
});
