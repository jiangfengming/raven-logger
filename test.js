/* eslint-disable no-console */

const Logger = require('./Logger')

const logger = new Logger()

console.log(logger.fatal(new Error('fatal')))

console.log(logger.error(new Error('error'), {
  user: {
    name: 'matt'
  }
}))

console.log(logger.warn('warn'))

console.log(logger.info('hello'))

console.log(logger.debug('debug'))

console.log(logger.log('debug', 'debug'))
