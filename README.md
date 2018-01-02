# raven-logger
Log messages to console and Sentry (optional).

## Why?
[winston](https://github.com/winstonjs/winston) and [winston-raven-sentry](https://github.com/niftylettuce/winston-raven-sentry) can do most of the jobs.
But one thing they don't give me is the sentry [event id](https://docs.sentry.io/clients/node/usage/#event-ids). This is often used to display for the user and report an error to customer service.

## Usage
```js
const raven = require('raven')
const Logger = require('raven-logger')

raven.config('https://<key>@sentry.io/<project>').install()

const logger = new Logger({ raven })

const { eventId } = logger.error(new Error('error'))
```

## APIs
### new Logger({ raven, timezone })
#### Arguments:
`raven`: Optional. The raven instance. If not provided, logs won't be send to sentry.  
`timezone`: Optional. Timezone of timestamp. `String`: [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). `true`: use system timezone. `false`: use UTC timezone. Default is `true`.

```js
new Logger({ raven, timezone: 'Asia/Shanghai' })
```

### Logger.log(level, message, meta)
#### Arguments:
`level`: Log level. `debug`, `info`, `warning`, `error`, `fatal`. Will be set as `level` of [Additional Data](https://docs.sentry.io/clients/node/usage/#additional-data) when sending to sentry.  
`message`: `String` or `Error` Object.  
`meta`: Will be stringify using [util.inspect](https://nodejs.org/api/util.html#util_util_inspect_object_options) and append to the message when logging to console. And will be used as [Additional Data](https://docs.sentry.io/clients/node/usage/#additional-data) when sending to sentry.  

#### Returns:
```js
{ timestamp, eventId }
```

### Logger.debug(message, meta)
Alias of Logger.log('debug', message, meta)

### Logger.info(message, meta)
Alias of Logger.log('info', message, meta)

### Logger.warn(message, meta)
Alias of Logger.log('warning', message, meta)

### Logger.error(message, meta)
Alias of Logger.log('error', message, meta)

### Logger.fatal(message, meta)
Alias of Logger.log('fatal', message, meta)
