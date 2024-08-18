const TelegramBot = require('node-telegram-bot-api');
const sharp = require('sharp');
const fetch = require('node-fetch');
const moment = require('moment');

// توكن البوت
const BOT_TOKEN = '6918277747:AAGA3O6SnzCEiHG7H8cRoutbw6kTbiZpJNs';

// إنشاء بوت تليجرام
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// دالة لحساب نسبة الحب بناءً على الأسماء
function calculateLovePercentage(name1, name2) {
    const combined = name1 + name2;
    const loveScore = (combined.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100);
    return loveScore;
}

// دالة لحساب نسبة الحب بناءً على أول الحروف
function calculateLoveFromFirstLetter(name1, name2) {
    const firstLetterScore = (name1.charCodeAt(0) + name2.charCodeAt(0)) % 100;
    return firstLetterScore;
}

// دالة لإنشاء الأزرار
function createButtons() {
    return {
        reply_markup: {
            keyboard: [
                ['نسبة الحب من الأسماء', 'نسبة الحب من أول حرف'],
                ['نسبة الحب من الصور', 'نسبة الحب من المواليد'],
                ['نسبة الحب من الأبراج']
            ],
            resize_keyboard: true
        }
    };
}

// التعامل مع /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "أهلاً بك في بوت نسبة الحب! اختر نوع الحساب:", createButtons());
});

// حساب نسبة الحب من الأسماء
bot.onText(/نسبة الحب من الأسماء/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "أرسل الأسماء بهذه الصيغة: اسم1 اسم2");
});

// حساب نسبة الحب من أول حرف
bot.onText(/نسبة الحب من أول حرف/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "أرسل الأسماء بهذه الصيغة: اسم1 اسم2");
});

// حساب نسبة الحب من الصور
bot.onText(/نسبة الحب من الصور/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "أرسل صورتين لحساب نسبة الحب.");
});

// حساب نسبة الحب من المواليد
bot.onText(/نسبة الحب من المواليد/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "أرسل تاريخي الميلاد بهذه الصيغة: يوم/شهر/سنة يوم/شهر/سنة");
});

// حساب نسبة الحب من الأبراج
bot.onText(/نسبة الحب من الأبراج/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "أرسل البرجين لحساب نسبة الحب بينهما.");
});

// التعامل مع الأسماء لحساب نسبة الحب
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.includes(' ')) {
        const [name1, name2] = text.split(' ');
        if (name1 && name2) {
            const lovePercentage = calculateLovePercentage(name1, name2);
            const firstLetterPercentage = calculateLoveFromFirstLetter(name1, name2);
            const response = `نسبة الحب بين ${name1} و ${name2} هي: ${lovePercentage}%\n` +
                             `نسبة الحب بناءً على أول حرف: ${firstLetterPercentage}%`;
            bot.sendMessage(chatId, response);
        }
    }
});

// التعامل مع الصور
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    try {
        const file = await bot.getFile(fileId);
        const filePath = file.file_path;
        const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

        const response = await fetch(url);
        const buffer = await response.buffer();
        
        // معالجة الصورة هنا باستخدام مكتبة مثل sharp
        await sharp(buffer).toFile('processed_image.png'); // تغيير اسم الملف حسب الحاجة

        bot.sendMessage(chatId, 'تم تحليل الصورة.');
    } catch (error) {
        bot.sendMessage(chatId, 'حدث خطأ أثناء معالجة الصورة.');
    }
});

// التعامل مع المواليد
bot.onText(/(\d{1,2}\/\d{1,2}\/\d{4})\s(\d{1,2}\/\d{1,2}\/\d{4})/, (msg, match) => {
    const chatId = msg.chat.id;
    const [birth1, birth2] = match.slice(1, 3);
    const age1 = moment().diff(moment(birth1, 'DD/MM/YYYY'), 'years');
    const age2 = moment().diff(moment(birth2, 'DD/MM/YYYY'), 'years');

    bot.sendMessage(chatId, `أعمار الأشخاص بناءً على تواريخ الميلاد: ${age1} و ${age2}`);
});

// التعامل مع الأبراج
bot.onText(/(برج1)\s(برج2)/, (msg, match) => {
    const chatId = msg.chat.id;
    const [zodiac1, zodiac2] = match.slice(1, 3);

    // هنا يمكنك إضافة خوارزمية لحساب نسبة الحب بناءً على الأبراج
    const response = `نسبة الحب بين ${zodiac1} و ${zodiac2} تعتمد على الأبراج.`;
    bot.sendMessage(chatId, response);
});
