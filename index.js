const telegramAPI = require('node-telegram-bot-api')
const token = '5074433539:AAGN8MhwZz8bO7lVq8ayRWElqn0DxNTbkN4'
const  bot  = new telegramAPI(token, {polling: true})
const {gameOptions, replayOptions} = require('./options')
const mongoose = require('mongoose')
const {mongoURL, channel_id} = require('./config/default.json')
const User = require('./models/Users')
const Meme = require('./models/Memes')
const {getList} = require("./helpers/tagsHelpers");
const { getTagsList } = require('./helpers/tagsHelpers')


bot.setMyCommands([
    {command: '/start', description: "Начальное действие"},
    {command: '/info', description: "Информация о боте"},
    {command: '/game', description: "Угадай число"}
])

const saveMemeToDatabase = () => {

}

const start = async () => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, () => {
        })
    } catch (e) {
        console.log(e);
    }

    bot.on('message',  async msg => {
        const {
            text,
            photo,
            caption,
            chat: { id: chatId}
            } = msg
        try {
           if (photo) {
               console.log(photo);
               console.log(caption);
               const fileId = photo[0].file_id

               if (fileId) {
                   await bot.sendPhoto(channel_id, fileId)
               }
               bot.on('channel_post',  post => {
                   console.log('channel_post');
                   console.log(post);
               })
               const list = getList(caption)
               console.log(list);
           }

        // >>2297508
        //     Вдруг мне повезло и тут кто-то сразу кто-то увидит ошибку.
        //
        //         Пикрелейтед, хочу реализовать следующее:
        //         - Отправляю боту картинку, он берет из сообщения photo и caption
        //     - Картинку с помощью её  fileId постит в канал
        //     - Этот же самый канал слушает  и когда в нем появляется пост,  берет из него что-нибудь,  вообще мне нужен id поста.
        //
            if (text){
                // console.log(text);
                // switch (text) {
                //     case '/start':
                //         await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/3.webp')
                //         await bot.sendMessage(chatId, 'Добро пожаловать!')
                //         const ifUserExists = await User.exists({chatId})
                //         if (!ifUserExists) {
                //             const user = await User.findOne({chatId})
                //             await user.save()
                //         }
                //         break
                // }
            }
        } catch (e) {
            return bot.sendMessage(chatId, e)
        }
    })

}
start()