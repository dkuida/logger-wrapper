/* tslint:disable */
module.exports = {
    service: 'some-service',
    console: {
        level: 'debug'
    },
    file: {
        level: 'debug',
        path: './logs/server.log',
        maxSize: 10000,
        maxFiles: 5
    }
    // logstash: {
    //     level: 'debug',
    //     nodeName: 'test',
    //     host: '',
    //     port: 27010
    // },
    // fluentd: {
    //     level: 'debug',
    //     host: '192.168.2.2',
    //     port: 31811,
    //     timeout: 3.0,
    //     reconnectInterval: 600000 // 10 minutes
    //
    // }
};
