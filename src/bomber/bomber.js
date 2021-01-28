const EventEmitter = require('events')
const fetch = require('node-fetch')

const userAgent = require('./utils/userAgent')
const createFormDataFromObject = require('./utils/createFromDataFromObject')

const DEFAULT_OPTIONS = {
    concurrency: 1,
    timeout: 1,
    limit: Infinity,
    offset: 0,
}

const defaultName = 'Андрей'

class Bomber extends EventEmitter {
    constructor(number, name = defaultName, options = {}) {
        super()

        this.number = number
        this.name = name
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

        const next = () => {
            this.cursor += 1

            this.next()
        }

        return this.createRequest(siteRequestInfo)
            .then(result => {
                if ('isSuccess' in siteRequestInfo && !siteRequestInfo.isSuccess(result)) {
                    return Promise.reject(result)
                }

                this.emit('send', { result, site: siteRequestInfo })

                this.success += 1

                if (timeout) {
                    setTimeout(() => next(), timeout)
                } else {
                    next()
                }
            })
            .catch((err) => {
                this.failed += 1
                
                this.emit('error', { err, site: siteRequestInfo })

                next()
            })
    }

    createRequest(siteRequestInfo) {
        const {
            url: getUrl,
            method = 'get',
            type = 'Object',
            body: getBody = () => ({}),
            parse = 'json',
            headers = {},
        } = siteRequestInfo
    
        const url = typeof getUrl === 'function' ? getUrl(this.number, this.name) : getUrl
        const body = type === 'FormData'
            ? createFormDataFromObject(getBody(this.number, this.name))
            : JSON.stringify(getBody(this.number, this.name))
    
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

    reset() {
        this.isRunning = false
        this.cursor = 0

        return this
    }

    start(data = []) {
        this.data = data
        this.isRunning = true
        this.count = data.length
        this.success = 0
        this.failed = 0

        this.next()

        return this
    }

    stop(silent = false) {
        this.isRunning = false

        if (!silent) {
            this.emit('finish')
        }

        return this
    }

    pause() {
        this.isRunning = false

        return this
    }

    resume() {
        this.isRunning = true

        this.next()

        return this
    }
}

module.exports = Bomber
