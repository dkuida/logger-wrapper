module.exports = function (wallaby) {
    return {
        files: [
            '__mocks__/**/*',
            'config/**/*',
            'src/**/*',
            'test/config/**/*'
        ],
        tests: [
            'test/**/*.test.js?(x)',
            'test/**/*.test.ts?(x)'
        ],

        compilers: {
            '**/*.ts?(x)': wallaby.compilers.typeScript({
                module: 'commonjs'
            })
        },

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest'
    };
};
