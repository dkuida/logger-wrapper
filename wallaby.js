'use strict';

const includes = require('./wallabyIncludes');

module.exports = function () {
    return {
        files: includes,

        tests: [
            'spec/**/*[sS]pec.js'
        ],
        env: {
            type: 'node',
            runner: 'node'
        },
        testFramework: 'jasmine'
    };
};
