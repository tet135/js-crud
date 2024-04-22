// Підключаємо технологію express для back-end сервера
const express = require('express')
const { ids } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, { email }) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувача видалено',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Пошта оновлена' : 'Сталася помилка',
  })
})
//
// Підключаємо роутер до бек-енду
module.exports = router

//========================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

//++++++++++++++++++++++++++

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
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  // res.render генерує нам HTML сторінку

  const product = new Product(name, price, description)

  Product.add(product)

  // console.log(Product.getList())

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    data: {
      message: 'Успішне виконання дії',
      info: 'Товар було успішно додано',
      link: '/product-list',
    },
  })
  // ↑↑ сюди вводимо JSON дані
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

// ↙️ тут вводимо шлях (PATH) до сторінки
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
