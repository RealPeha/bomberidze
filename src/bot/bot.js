const { Telegraf, session, Extra } = require('telegraf')
const { Keyboard } = require('telegram-keyboard')
const dedent = require('dedent')

const Call = require('../bomber/call')
const SMS = require('../bomber/sms')

const callServices = require('../bomber/services/call')
const smsServices = require('../bomber/services/sms')

const BOMBERS = {
    CALL: 'Call',
    SMS: 'SMS',
}

const bot = new Telegraf(process.env.BOT_TOKEN)

const html = Extra.HTML()
const noop = () => 42
const spamTypeKeyboard = Keyboard.reply(['✉️ СМС', '☎️ Звонки'], {}, html)

const start = ctx => {
    return ctx.reply(dedent`
        Привет 👨‍💻

        ☎️ <b>Сервисов для звонков:</b> <code>${callServices.length}</code>
        ✉️ <b>Сервисов для смс:</b> <code>${smsServices.length}</code>

        Выбери нужный тебе тип атаки, чтобы начать
    `, spamTypeKeyboard)
}

bot.use(session())

bot.start(start)

bot.hears('✉️ СМС', (ctx) => {
    if (ctx.session.bomber && ctx.session.bomber.isRunning) {
        return ctx.reply('Бомбер уже запущен', Keyboard.reply('Остановить'))
    }

    ctx.session.bomberType = BOMBERS.SMS

    return ctx.reply('Введи номер жертвы (начиная с <code>+38</code>)', {...Keyboard.remove(), parse_mode: 'HTML'})
})

bot.hears('☎️ Звонки', (ctx) => {
    if (ctx.session.bomber && ctx.session.bomber.isRunning) {
        return ctx.reply('Бомбер уже запущен', Keyboard.reply('Остановить'))
    }

    ctx.session.bomberType = BOMBERS.CALL

    return ctx.reply('Введи номер жертвы (начиная с <code>+38</code>)', {...Keyboard.remove(), parse_mode: 'HTML'})
})

bot.hears('Остановить', async (ctx, next) => {
    if (ctx.session.bomber) {
        ctx.session.bomber.stop()

        await ctx.reply('Остановлено')
    }

    ctx.session = {}

    return next()
}, start)

bot.hears('Начать атаку', async ({ session, chat, telegram, reply}) => {
    if (session.bomber && !session.bomber.isRunning) {
        await reply('Начинаю атаковать...', Keyboard.reply('Остановить'))

        session.bomber.start()
            .on('task_finish', (taskId, { result, site }) => {
                telegram.sendMessage(
                    chat.id,
                    `[${session.bomber.success} / ${session.bomber.amount}] Успешно: <code>${site.baseUrl || site.url}</code>`,
                    html
                ).catch(noop)
            })
            .on('task_failed', (taskId, { err, site }) => {
                telegram.sendMessage(
                    chat.id,
                    `[${session.bomber.success} / ${session.bomber.amount}] Не удалось: <code>${site.baseUrl || site.url}\n${JSON.stringify(err, null, 2)}</code>`,
                    html
                ).catch(noop)
            })
            .on('drain', () => {
                telegram.sendMessage(
                    chat.id,
                    dedent`
                        Бомбардировка закончена

                        <b>Успешно:</b> ${session.bomber.success} / ${session.bomber.amount} 
                    `,
                    Keyboard.reply('Отлично', {}, html)
                ).catch(noop)
            })
    }
})

bot.hears(['Отмена', 'Отлично'], Telegraf.tap(ctx => ctx.session = {}), start)

bot.on('text', ({ session, message, reply }) => {
    if (session.bomber) {
        return
    }

    if (!session.bomberType) {
        return reply('Сначала выбери тип атаки', spamTypeKeyboard)
    }

    let text = message.text.trim()

    if (!session.number) {
        text = text.replace(/[\s-()]/g, '')

        if (!text.startsWith('+380')) {
            return reply('Номер должен начинаться с <code>+380</code>', html)
        }
    
        if (text.length !== 13) {
            return reply('Что-то не так с номером')
        }
    }

    switch (session.bomberType) {
        case BOMBERS.CALL: {
            if (session.number) {
                session.bomber = new Call({
                    number: session.number,
                    name: text || '',
                })
            } else {
                session.number = text

                return reply('👤 Теперь введи имя жертвы')
            }

            break
        }
        case BOMBERS.SMS: {
            session.bomber = new SMS({ number: text })
        }
    }

    return reply('Готов начать?', Keyboard.reply(['Начать атаку', 'Отмена']))
})

module.exports = bot
