
# dead simple winston confiiguration loader

## Build Setup

``` bash
# Install dependencies
npm install @dkuida/logger-wrapper
```

## usage

### short version 

check the examples folder

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

## License

The MIT License (MIT)

Copyright (c) 2018 restify

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
