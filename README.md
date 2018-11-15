# raven-logger
Log messages to console and Sentry (optional).

## Why?
[winston](https://github.com/winstonjs/winston) and
[winston-raven-sentry](https://github.com/niftylettuce/winston-raven-sentry) can do most of the jobs.
But one thing they don't give me is the sentry [event id](https://docs.sentry.io/clients/node/usage/#event-ids).
This is often used to display for the user and report an error to customer service.

## Usage
```js
const sentry = require('@sentry/node')
const Logger = require('raven-logger')

sentry.init({ dsn: 'https://<key>@sentry.io/<project>' })

const logger = new Logger({ sentry })

const { timestamp, eventId } = logger.error(new Error('error'))
```

## APIs
### new Logger({ sentry, timezone, logLevel = 'debug', reportLevel: 'info' })
#### Arguments:
`sentry`: Optional. The [sentry module](https://www.npmjs.com/package/@sentry/node). If not provided, logs won't be send to sentry.

`timezone`: Optional. Timezone of timestamp. Defaults to `true`.
  * `String`: [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
  * `true`: use system timezone.
  * `false`: use UTC timezone.

`logLevel`: Optional. What level of logs should output to stdout.
  Only log level higher than or equal to the given level will be logged.
  Defaults to `debug`.

`reportLevel`: Optional. What level of logs should report to sentry server.
  Only log level higher than or equal to the given level will be reported.
  Defaults to `info`.

```js
new Logger({ sentry, timezone: 'Asia/Shanghai' })
```

### Logger.log(level, ...messages)
#### Arguments:
`level`: Log level. `debug`, `info`, `warning`, `error`, `fatal`.
`...message`: same arguments as `console.log(...messages)`

#### Returns:
```js
{ timestamp, eventId }
```

If the log level is disabled logging, `timestamp` and `eventId` will be empty string.

### Logger.debug(...messages)
Alias of Logger.log('debug', ...messages)

### Logger.info(...messages)
Alias of Logger.log('info', ...messages)

### Logger.warn(...messages)
Alias of Logger.log('warning', ...messages)

### Logger.error(...messages)
Alias of Logger.log('error', ...messages)

### Logger.fatal(...messages)
Alias of Logger.log('fatal', ...messages)

### Logger.level
Set log level.

```js
logger.level = 'info'
```
