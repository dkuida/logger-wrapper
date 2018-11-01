'use strict';

module.exports = {
    service: 'some-service',
    console: {
        level: 'debug'
    },
    file: {
        level: 'debug',
        path: './logs/json-server.log',
        maxSize: 5242880,
        maxFiles: 5
    },
    logstash: {
        level: 'debug',
        nodeName: 'test',
        host: '',
        port: 27010
    },
    logzio: {
        name: 'logz-io',
        level: 'error',
        token: '',
        host: 'listener.logz.io',
        type: 'log-test'
    }
};

