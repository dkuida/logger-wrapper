const fluentTransportMock = jest.fn().mockImplementation(() => ({log: jest.fn(), on: jest.fn()}));
const winstonTransportMock = jest.fn().mockReturnValue(fluentTransportMock);
jest.mock('fluent-logger', () => ({
    support: {
        winstonTransport: winstonTransportMock
    }
}));
import loggerBuilder from '../src/logger';

describe('fluentd tansport', () => {
    const loggerInstance = loggerBuilder({
        fluentd: {
            level: 'debug'
        }
    });
    loggerInstance(module);
    test('config passed', () => {
        expect(winstonTransportMock).toHaveBeenCalledTimes(1);
        expect(fluentTransportMock)
                .toHaveBeenCalledWith(expect.stringMatching(/test\/fluentd.test.[j|t]s/),
                        {level: 'debug', requireAckResponse: true});
    });
});
