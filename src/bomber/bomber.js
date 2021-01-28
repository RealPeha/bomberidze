const fetch = require('node-fetch')
const Queue = require('better-queue')

const userAgent = require('./utils/userAgent')
const createFormDataFromObject = require('./utils/createFromDataFromObject')

const DEFAULT_OPTIONS = {
    concurrency: 1,
    timeout: 1,
}

const createRequest = (siteRequestData, bodyData) => {
    const {
        url: getUrl,
        method = 'get',
        type = 'Object',
        body: getBody = () => ({}),
        parse = 'json',
        headers = {},
    } = siteRequestData

    const { number, name } = bodyData

    const url = typeof getUrl === 'function' ? getUrl(number, name) : getUrl
    const body = type === 'FormData'
        ? createFormDataFromObject(getBody(number, name))
        : JSON.stringify(getBody(number, name))

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

class Bomber {
    constructor(services, body, options = {}) {
        this.services = services
        this.body = body
        this.amount = services.length
        this.options = {...DEFAULT_OPTIONS, ...options}

        this.isRunning = false
        this.success = 0
        this.failed = 0
        this.processed = 0

        this.queue = new Queue(this.processor, {
            afterProcessDelay: this.options.timeout,
            concurrent: this.options.concurrency
        })
            .on('drain', () => this.isRunning = false)
            .on('task_started', () => this.processed += 1)
            .on('task_failed', () => this.failed += 1)
            .on('task_finish', () => this.success += 1)
    }

    processor = (siteRequestData, next) => {
        console.log('process')
        return createRequest(siteRequestData, this.body)
            .then(result => {
                if ('isSuccess' in siteRequestData && !siteRequestData.isSuccess(result)) {
                    return Promise.reject(result)
                }

                return next(null, { result, site: siteRequestData })
            })
            .catch((err) => next({ err, site: siteRequestData }))
    }

    start(options = {}) {
        this.options = {...this.options, ...options}
        this.isRunning = true
        this.success = 0
        this.failed = 0
        this.processed = 0

        this.services.forEach(service => {
            this.queue.push(service)
        })

        return this.queue
    }

    stop() {
        this.queue.pause()
        this.queue.destroy()
    }
}

module.exports = Bomber
