const { randomBytes } = require('crypto')

function uid(n = 16) {
  return randomBytes(n).toString('hex')
}

module.exports = uid
