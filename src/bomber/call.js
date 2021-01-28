const Bomber = require('./bomber')

const callServices = require('./services/call')

class Call extends Bomber {
    constructor(body, options) {
        super(callServices, body, options)
    }
}

module.exports = Call
