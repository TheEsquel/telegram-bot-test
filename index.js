const telegramAPI = require('node-telegram-bot-api')

const token = '5074433539:AAGN8MhwZz8bO7lVq8ayRWElqn0DxNTbkN4'

const  bot  = new telegramAPI(token, {polling: true})

const {gameOptions, replayOptions} = require('./options')

bot.setMyCommands([
    {command: '/start', description: "Начальное действие"},
    {command: '/info', description: "Информация о боте"},
    {command: '/game', description: "Угадай число"}
])

const chats = {}

const startGame =  chatId => {
    const num = Math.floor(Math.random() * 10)
    chats[chatId] = num
    console.log(num);
    return bot.sendMessage(chatId, `Я загадал число,  попробуй отгадать`,  gameOptions)
}

const  start = () => {

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/3.webp')
            await bot.sendMessage(chatId, 'Добро пожаловать к мемлорду')
        }
        if (text === '/info') {
            await bot.sendMessage(chatId, 'Этот бот посвящен сбору и бережному хранению мемов')
        }
        if (text === '/game') {
            await bot.sendMessage(chatId, 'Хочу сыграть с тобой в игру')
            return  startGame(chatId)
        }
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return await startGame(chatId)
        }
        if (data === chats[chatId].toString()) {
            return  bot.sendMessage(chatId,'Угадал!',  replayOptions)
        } else {
            return bot.sendMessage(chatId,'Попробуй еще!',  replayOptions)
        }

    })
}
start()