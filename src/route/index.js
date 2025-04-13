// Підключаємо технологію express для back-end сервера
const e = require('express')
const express = require('express')
const { emit } = require('nodemon')
const { ids } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
//++++++
// Я додала для підключиння інших файлів з route
const purchase = require('./purchase')
const spotify = require('./spotify')
const user = require('./user')
const product = require('./product')

// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
router.use('/', purchase)
router.use('/', spotify)
router.use('/', user)
router.use('/', product)
//================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('home-page', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'home-page',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ===============================================//

// Підключаємо роутер до бек-енду
module.exports = router
