[![Build Status](https://travis-ci.com/dkuida/logger-wrapper.svg?branch=master)](https://travis-ci.com/dkuida/logger-wrapper)
# wrapper for winston configuration loader

## Build Setup

``` bash
# Install dependencies
npm install @dkuida/logger-wrapper
```

## usage

### short version 

check the example folder

###longer version
the config file will initialize the availbale transports by passing the configuration to each 

* console - official winston console

* file - official winston file logger

* fluentd - using [fluent-logger](https://github.com/fluent/fluent-logger-node)

* logstash - have a look at [winston-logstash-transport](https://github.com/dkuida/winston-logstash)

* service - a common name that will be identify the project/service
create a singleton loader in the form of 

```typescript
 import logger from '@dkuida/logger-wrapper';
 import * as loggerConfig from './config/logger';
 const loggerInstance = logger(loggerConfig);
 
 export default loggerInstance;
```

use the logger wherever you need
```typescript
import loggerInstance from './logger';
const logger = loggerInstance(module);
logger.info('HELLO');
```

The label for the log message is extracted from the (module) - and is the file in which the call was invoked.
In case you use [moleculer.js](https://moleculer.services/) you can add a property

```typescript
labelExtractors: [LabelExtractor.moleculer]
```

which allow on service call to extract the labels for the nodes/brokers

## Breaking changes

###### 1.6.x
* winston, winston-logstash-transport, fluentd-logger are all peer dependencies now.

###### 1.5.x
* the logger is not exported as default from the library
* fatal level removed

# License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).
