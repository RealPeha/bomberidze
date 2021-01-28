require('dotenv').config()

const bot = require('./bot')

const launch = async () => {
    await bot.launch()
}

launch()
