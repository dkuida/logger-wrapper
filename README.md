
# dead simple winston confiiguration loader

## Build Setup

``` bash
# Install dependencies
npm install @dkuida/logger-wrapper
```

## usage

### short version 

check the example folder

###longer version
create a configuration file with a property for each available transport 

* console - official winston console
* file - official winston file logger
* logstash - have a look at [winston-logstash-transport](https://github.com/dkuida/winston-logstash)
* service - a common name that will be identify the project/service
create a singleton loader in the form of 

```typescript
 import logger from '@dkuida/logger-wrapper';
 import * as loggerConfig from './config/logger';
 const loggerInstance = logger(loggerConfig);
 
 export default loggerInstance;

```

use the logger wherever you like with
```typescript
import loggerInstance from './logger';
const logger = loggerInstance(module);
logger.info('HELLO');
```

## Breaking changes

* the logger is not exported as default from the library
* fatal level removed

## License

The MIT License (MIT)
