const chalk = require('chalk')
const { format } = require('util')
const moment = require('moment-timezone')
const uid = require('./uid')

const colors = {
  critical: chalk.bold.red,
  fatal: chalk.red,
  error: chalk.magenta,
  warning: chalk.yellow,
  info: chalk.green,
  log: chalk.blue,
  debug: chalk.white
}

const logLevels = ['critical', 'fatal', 'error', 'warning', 'info', 'log', 'debug']

class Logger {
  constructor({ sentry, timezone = true, logLevel = 'debug', reportLevel = 'info', debugTrace = true } = {}) {
    this.sentry = sentry
    this.timezone = timezone
    this.logLevel = logLevel
    this.reportLevel = reportLevel
    this.debugTrace = debugTrace
  }

  _log(level, ...messages) {
    if (level === 'warn') level = 'warning'

    if (logLevels.indexOf(level) > logLevels.indexOf(this.logLevel)) {
      return { timestamp: '', eventId: '' }
    }

    let trace
    const error = messages.find(m => m instanceof Error)
    if (!error && this.logLevel === 'debug' && this.debugTrace) {
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

    let eventId = ''
    if (logLevels.indexOf(level) <= logLevels.indexOf(this.reportLevel)) {
      if (this.sentry) {
        if (error) {
          this.sentry.withScope(scope => {
            scope.setLevel(level)
            if (messages.length > 1) {
              scope.setExtra('message', msg)
            }
            eventId = this.sentry.captureException(error)
          })
        } else {
          eventId = this.sentry.captureMessage(msg, level)
        }
      } else {
        eventId = uid()
      }
    }

    msg = colors[level](
      `[${timestamp}]${eventId ? '[' + eventId + ']' : ''} [${level}] ${msg}${trace ? '\n' + trace : ''}`
    )

    if (['fatal', 'error', 'warning'].includes(level)) {
      console.error(msg) // eslint-disable-line
    } else {
      console.log(msg) // eslint-disable-line
    }

    return { timestamp, eventId }
  }

  critical(...messages) {
    return this._log('critical', ...messages)
  }

  fatal(...messages) {
    return this._log('fatal', ...messages)
  }

  error(...messages) {
    return this._log('error', ...messages)
  }

  warn(...messages) {
    return this._log('warning', ...messages)
  }

  info(...messages) {
    return this._log('info', ...messages)
  }

  log(...messages) {
    return this._log('log', ...messages)
  }

  debug(...messages) {
    return this._log('debug', ...messages)
  }
}

module.exports = Logger
