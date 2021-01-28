const Call = require('./call')

const { calls: callServices } = require('./services')

const call = new Call('+380953038461', {
    // limit: 2,
    // offset: 1,
})

call
    .start(callServices)
    .on('send', ({ result, site }) => {
        console.log(`Success: ${site.url}`)
    })
    .on('error', ({ err, site }) => {
        console.log(`Failed: ${site.url}`, err)
    })
    .on('finish', () => {

    })
    