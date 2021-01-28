const Bomber = require('./bomber')

const smsServices = require('./services/sms')

class SMS extends Bomber {
    constructor(body, options) {
        super(smsServices, body, options)
    }
}

module.exports = SMS
