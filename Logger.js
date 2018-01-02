const colors = require('colors/safe')
const { inspect } = require('util')
const moment = require('moment-timezone')
const uid = require('./uid')

colors.setTheme({
  fatal: ['red', 'bold'],
  error: 'red',
  warning: 'yellow',
  info: 'green',
  debug: 'blue'
})

class Logger {
  constructor({ raven, timezone = true } = {}) {
    this.raven = raven
    this.timezone = timezone
  }

  log(level, message, meta) {
    let error
    if (message instanceof Error) {
      error = message
      message = inspect(error)
    }

    let timestamp
    if (this.timezone === true) {
      timestamp = moment().format()
    } else if (!this.timezone) {
      timestamp = new Date().toISOString()
    } else {
      timestamp = moment().tz(this.timezone).format()
    }

    let eventId
    if (this.raven && this.raven.installed) {
      eventId = error ? this.raven.captureException(error, { level, ...meta }) : this.raven.captureMessage(message, { level, ...meta })
    } else {
      eventId = uid()
    }

    let msg = `[${timestamp}] [${eventId}] [${level.toUpperCase()}] ${message}`
    if (meta) msg += '\n    meta: ' + inspect(meta)
    msg = colors[level](msg)

    if (['fatal', 'error', 'warning'].includes(level)) {
      console.error(msg) // eslint-disable-line
    } else {
      console.log(msg) // eslint-disable-line
    }

    return { timestamp, eventId }
  }

  fatal(...args) {
    return this.log('fatal', ...args)
  }

  error(...args) {
    return this.log('error', ...args)
  }

  warn(...args) {
    return this.log('warning', ...args)
  }

  info(...args) {
    return this.log('info', ...args)
  }

  debug(...args) {
    return this.log('debug', ...args)
  }
}

module.exports = Logger
