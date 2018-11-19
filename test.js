/* eslint-disable no-console */

const Logger = require('./Logger')

const logger = new Logger()

logger.critical(new Error('critical'))
logger.fatal(new Error('fatal'))
logger.error(new Error('error'))
logger.warn('warn')
logger.info('hello')
logger.log('log', 'msg')
logger.debug('debug')
