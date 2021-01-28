const EventEmitter = require('events')
const fetch = require('node-fetch')
const FormData = require('form-data')
const userAgent = require('random-useragent').getRandom

const createFormDataFromObject = (object) => {
    const formData = new FormData()

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            formData.append(key, object[key])
        }
    }

    return formData
}

const createRequest = (number, siteRequestInfo) => {
    const {
        url: getUrl,
        method = 'get',
        type = 'Object',
        body: getBody = () => ({}),
        parse = 'json',
        headers = {},
    } = siteRequestInfo

    const url = typeof getUrl === 'function' ? getUrl(number) : getUrl
    const body = type === 'FormData'
        ? createFormDataFromObject(getBody(number))
        : JSON.stringify(getBody(number))

    if (method === 'get') {
        return fetch(url, {
            headers: {
                'User-Agent': userAgent(),
                ...headers,
            },
        }).then(res => res[parse]())
    }

    return fetch(url, {
        method: method.toUpperCase(),
        body,
        headers: {
            'User-Agent': userAgent(),
            ...headers,
        },
    }).then(res => res[parse]())
}

const DEFAULT_OPTIONS = {
    concurrency: 1,
    timeout: 1,
    limit: Infinity,
    offset: 0,
}

class Call extends EventEmitter {
    constructor(number, options = {}) {
        super()

        this.number = number
        this.options = {...DEFAULT_OPTIONS, ...options}
        this.cursor = this.options.offset
        this.isRunning = false
        this.data = []
    }

    next() {
        if (!this.data || !this.data.length) {
            throw new Error('data is empty')
        }

        if (!this.isRunning) {
            return
        }

        const { timeout, limit } = this.options
        
        const siteRequestInfo = this.data[this.cursor]

        if (!siteRequestInfo || this.cursor >= (this.options.offset + limit)) {
            return this.stop()
        }

        const request = createRequest(this.number, siteRequestInfo)

        const next = () => {
            this.cursor += 1

            this.next()
        }

        return request
            .then(result => {
                if ('isSuccess' in siteRequestInfo && !siteRequestInfo.isSuccess(result)) {
                    return Promise.reject(result)
                }

                this.emit('send', { result, site: siteRequestInfo })

                if (timeout) {
                    setTimeout(() => next(), timeout)
                } else {
                    next()
                }
            })
            .catch((err) => {
                this.emit('error', { err, site: siteRequestInfo })

                next()
            })
    }

    reset() {
        this.isRunning = false
        this.cursor = 0

        return this
    }

    start(data = []) {
        this.data = data
        this.isRunning = true

        this.next()

        return this
    }

    stop() {
        this.isRunning = false

        this.emit('finish')

        return this
    }
}

module.exports = Call
