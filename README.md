[![Moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](https://moleculer.services)

# dead simple winston confiiguration loader

## Build Setup

``` bash
# Install dependencies
npm install @dkuida/loggeer-wrapper
```

## usage

### short version 

check the examples folder

###longer version
create a configuration file with a property for each available transport 

* console - official winston console
* file - official winston file logger
* logstashudp - have a look at [winston-logstash-transport](https://github.com/liuyanjie/winston-logstash-transport)
* logzio - have a look at [winston-logzio](https://github.com/logzio/winston-logzio)
* service - a common name that will be identify the project/service
create a singleton loader in the form of 

```javascript 1.8
 const logger = require('@dkuida/logger-wrapper');
 const loggerConfig = require('./config/logger');
 const loggerInstance = logger(loggerConfig);
 
 module.exports = loggerInstance;

```

use teh logger wherever you like with
```javascript 1.8
const logger = require('./logger')(module);
logger.info('HELLO');
```
