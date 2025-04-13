// Підключаємо технологію express для back-end сервера
const express = require('express')
const { ids } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//==================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.round(Math.random() * 100000) //ok
    this.createDate = new Date().toISOString() //2024-03-18T10:54:54.710Z
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => this.#list

  static add = (product) => this.#list.push(product)

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = function (
    id,
    { name, price, description },
  ) {
    const product = this.getById(Number(id))

    if (product) {
      if (name) {
        product.name = name
      }

      if (price) {
        product.price = price
      }

      if (description) {
        product.description = description
      }

      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)

      return true
    } else {
      return false
    }
  }
}
// ================================================================
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  // console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішне виконання дії',
      info: 'Товар було успішно додано',
      link: '/product-list',
    },
  })
})

// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()

  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  productToEdit = Product.getById(Number(id))

  if (productToEdit) {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        productToEdit,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Дія не виконана',
        info: 'Товар з таким ID не знайдено',
        link: '/product-list',
      },
    })
  }

  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  result = Product.updateById(id, {
    name,
    price,
    description,
  })

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    data: {
      message: result
        ? 'Успішне виконання дії'
        : 'Дія не виконана',
      info: result
        ? 'Дані про товар оновлені'
        : 'Сталася помилка',
      link: '/product-list',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  result = Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    data: {
      message: result
        ? 'Успішне виконання дії'
        : 'Дія не виконана',
      info: result ? 'Товар видалено' : 'Сталася помилка',
      link: '/product-list',
    },
  })
})

// ===============================================//
// Підключаємо роутер до бек-енду
module.exports = router
