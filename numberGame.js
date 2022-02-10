const telegramAPI = require('node-telegram-bot-api')
const token = '5074433539:AAGN8MhwZz8bO7lVq8ayRWElqn0DxNTbkN4'
const  bot  = new telegramAPI(token, {polling: true})
const {gameOptions, replayOptions} = require('./options')
const mongoose = require('mongoose')
const {mongoURL, channel_id} = require('./config/default.json')
const User = require('./models/Users')


bot.setMyCommands([
    {command: '/start', description: "Начальное действие"},
    {command: '/info', description: "Информация о боте"},
    {command: '/game', description: "Угадай число"}
])

const game_numbers = {}

const startGame =  chatId => {
    game_numbers[chatId] = Math.floor(Math.random() * 10)
    return bot.sendMessage(chatId, `Я загадал число,  попробуй отгадать`,  gameOptions)
}

const  start = async () => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, () => {
        })
    } catch (e) {
        console.log(e);
    }

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg);
        try {
            switch (text) {
                case '/start':
                    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/3.webp')
                    await bot.sendMessage(chatId, 'Добро пожаловать!')
                    const ifUserExists = await User.exists({chatId})
                    if (!ifUserExists) {
                        const user = await User.findOne({chatId})
                        await user.save()
                    }

                    break
                case '/info':
                    const user = await User.findOne({chatId})
                    await bot.sendMessage(chatId, 'Информация о пользователе: \n' +
                        `- правильных ответов:  ${user.right}\n- неправильных ответов:  ${user.wrong}`)
                    break
                case '/game':
                    return  startGame(chatId)
            }
            if (msg.photo) {
                bot.sendMessage(channel_id, 'test message', )
                bot.sendPhoto(channel_id, msg.photo[2].file_id)
            }
        } catch (e) {
            return bot.sendMessage(chatId, e)
        }
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const user = await User.findOne({chatId})
        const num = game_numbers[chatId].toString()
        switch (data) {
            case '/again':
                return await startGame(chatId)
            case num:
                user.right += 1
                user.save()
                return  bot.sendMessage(chatId,'Угадал!',  replayOptions)

            default:
                user.wrong += 1
                user.save()
                return bot.sendMessage(chatId,`Нет, число было ${num}`,  replayOptions)
        }
    })
}
start()