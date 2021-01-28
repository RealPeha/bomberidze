const crypto = require('crypto')

const nonce = () => crypto.randomBytes(5).toString('hex')

module.exports = nonce
