import telebot
from telebot import types
from PIL import Image
import numpy as np
import requests

# توكن البوت
BOT_TOKEN = "6918277747:AAGA3O6SnzCEiHG7H8cRoutbw6kTbiZpJNs"
CHANNEL_USERNAME = "@freeusr"  # اسم المستخدم الخاص بقناتك

# إنشاء بوت تليجرام
bot = telebot.TeleBot(BOT_TOKEN)

# وظيفة لفحص ما إذا كان المستخدم عضوًا في القناة
def is_user_in_channel(user_id):
    try:
        member = bot.get_chat_member(CHANNEL_USERNAME, user_id)
        if member.status in ['member', 'administrator', 'creator']:
            return True
        return False
    except Exception as e:
        return False

# دالة لحساب نسبة الحب بناءً على الأسماء
def calculate_love_percentage(name1, name2):
    combined = name1 + name2
    love_score = (sum(ord(char) for char in combined) % 100)
    return love_score

# دالة لحساب نسبة الحب بناءً على أول الحروف
def calculate_love_from_first_letter(name1, name2):
    first_letter_score = (ord(name1[0]) + ord(name2[0])) % 100
    return first_letter_score

# دالة لإنشاء الأزرار
def create_buttons():
    markup = types.ReplyKeyboardMarkup(row_width=2)
    button1 = types.KeyboardButton("نسبة الحب من الأسماء")
    button2 = types.KeyboardButton("نسبة الحب من أول حرف")
    button3 = types.KeyboardButton("نسبة الحب من الصور")
    button4 = types.KeyboardButton("نسبة الحب من المواليد")
    button5 = types.KeyboardButton("نسبة الحب من الأبراج")
    markup.add(button1, button2, button3, button4, button5)
    return markup

# التعامل مع /start
@bot.message_handler(commands=['start'])
def send_welcome(message):
    if is_user_in_channel(message.from_user.id):
        markup = create_buttons()
        bot.send_message(message.chat.id, "أهلاً بك في بوت نسبة الحب! اختر نوع الحساب:", reply_markup=markup)
    else:
        bot.send_message(message.chat.id, f"يرجى الانضمام إلى القناة أولاً {CHANNEL_USERNAME}.")

# حساب نسبة الحب من الأسماء
@bot.message_handler(func=lambda message: message.text == "نسبة الحب من الأسماء")
def ask_for_names(message):
    if is_user_in_channel(message.from_user.id):
        bot.send_message(message.chat.id, "أرسل الأسماء بهذه الصيغة: اسم1 اسم2")
    else:
        bot.send_message(message.chat.id, f"يرجى الانضمام إلى القناة أولاً {CHANNEL_USERNAME}.")

# حساب نسبة الحب من أول حرف
@bot.message_handler(func=lambda message: message.text == "نسبة الحب من أول حرف")
def ask_for_first_letter_names(message):
    if is_user_in_channel(message.from_user.id):
        bot.send_message(message.chat.id, "أرسل الأسماء بهذه الصيغة: اسم1 اسم2")
    else:
        bot.send_message(message.chat.id, f"يرجى الانضمام إلى القناة أولاً {CHANNEL_USERNAME}.")

# حساب نسبة الحب من الصور
@bot.message_handler(func=lambda message: message.text == "نسبة الحب من الصور")
def ask_for_images(message):
    if is_user_in_channel(message.from_user.id):
        bot.send_message(message.chat.id, "أرسل صورتين لحساب نسبة الحب.")
    else:
        bot.send_message(message.chat.id, f"يرجى الانضمام إلى القناة أولاً {CHANNEL_USERNAME}.")

# حساب نسبة الحب من المواليد
@bot.message_handler(func=lambda message: message.text == "نسبة الحب من المواليد")
def ask_for_birthdays(message):
    if is_user_in_channel(message.from_user.id):
        bot.send_message(message.chat.id, "أرسل تاريخي الميلاد بهذه الصيغة: يوم/شهر/سنة يوم/شهر/سنة")
    else:
        bot.send_message(message.chat.id, f"يرجى الانضمام إلى القناة أولاً {CHANNEL_USERNAME}.")

# حساب نسبة الحب من الأبراج
@bot.message_handler(func=lambda message: message.text == "نسبة الحب من الأبراج")
def ask_for_zodiacs(message):
    if is_user_in_channel(message.from_user.id):
        bot.send_message(message.chat.id, "أرسل البرجين لحساب نسبة الحب بينهما.")
    else:
        bot.send_message(message.chat.id, f"يرجى الانضمام إلى القناة أولاً {CHANNEL_USERNAME}.")

# التعامل مع الأسماء لحساب نسبة الحب
@bot.message_handler(func=lambda message: len(message.text.split()) == 2)
def send_love_percentage(message):
    try:
        name1, name2 = message.text.split()
        love_percentage = calculate_love_percentage(name1, name2)
        first_letter_percentage = calculate_love_from_first_letter(name1, name2)
        response = (f"نسبة الحب بين {name1} و {name2} هي: {love_percentage}%\n"
                    f"نسبة الحب بناءً على أول حرف: {first_letter_percentage}%")
        bot.send_message(message.chat.id, response)
    except Exception as e:
        bot.send_message(message.chat.id, "حدث خطأ في الحساب. تأكد من أنك أدخلت الأسماء بشكل صحيح.")

# بدء تشغيل البوت
bot.infinity_polling()
