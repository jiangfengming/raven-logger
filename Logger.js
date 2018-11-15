const chalk = require('chalk')
const { format } = require('util')
const moment = require('moment-timezone')
const uid = require('./uid')

const colors = {
  fatal: chalk.bold.red,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.green,
  debug: chalk.blue
}

const logLevels = ['fatal', 'error', 'warning', 'info', 'debug']

class Logger {
  constructor({ sentry, timezone = true, logLevel = 'debug', reportLevel = 'info' } = {}) {
    this.sentry = sentry
    this.timezone = timezone
    this.logLevel = logLevel
    this.reportLevel = reportLevel
  }

  log(level, ...messages) {
    if (logLevels.indexOf(level) > logLevels.indexOf(this.logLevel)) {
      return { timestamp: '', eventId: '' }
    }

    let error, trace
    if (messages[0] instanceof Error) {
      error = messages[0]
    } else if (this.logLevel === 'debug') {
      const obj = {}
      Error.captureStackTrace(obj)
      const lines = obj.stack.split('\n')
      lines.shift()
      trace = lines.find(line => !line.trim().startsWith('at Logger'))
    }

    let msg = format(...messages)

    let timestamp
    if (this.timezone === true) {
      timestamp = moment().format()
    } else if (!this.timezone) {
      timestamp = new Date().toISOString()
    } else {
      timestamp = moment().tz(this.timezone).format()
    }

    let eventId
    if (this.sentry && logLevels.indexOf(level) > logLevels.indexOf(this.reportLevel)) {
      eventId = error
        ? this.sentry.captureException(error)
        : this.sentry.captureMessage(msg, level)
    } else {
      eventId = uid()
    }

    msg = `[${timestamp}] [${eventId}] [${level.toUpperCase()}] ${msg}`
    if (trace) msg += '\n' + trace
    msg = colors[level](msg)

    if (['fatal', 'error', 'warning'].includes(level)) {
      console.error(msg) // eslint-disable-line
    } else {
      console.log(msg) // eslint-disable-line
    }

    return { timestamp, eventId }
  }

  fatal(...messages) {
    return this.log('fatal', ...messages)
  }

  error(...messages) {
    return this.log('error', ...messages)
  }

  warn(...messages) {
    return this.log('warning', ...messages)
  }

  info(...messages) {
    return this.log('info', ...messages)
  }

  debug(...messages) {
    return this.log('debug', ...messages)
  }
}

module.exports = Logger
