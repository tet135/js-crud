// Підключаємо технологію express для back-end сервера
const e = require('express')
const express = require('express')
const { emit } = require('nodemon')
const { ids } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
//VIDEO 17`20``

class Track {
  //приватне статичне поле для зберігання об'єктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  //статичний метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  //статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  //статичний метод для отримання треку по його id
  static getById(id) {
    return (
      this.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create(
  'Інь і Янь',
  'Монатік',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez і Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'DÁKITI',
  'BAD BUNNY і JHAY',
  'https://picsum.photos/100/100',
)
Track.create(
  'La fee',
  'ZAZ',
  'https://picsum.photos/100/100',
)
Track.create(
  '24/02',
  'Без обмежень',
  'https://picsum.photos/100/100',
)
Track.create(
  'Люди як кораблі',
  'Скрябін',
  'https://picsum.photos/100/100',
)

// console.log(Track.getList())

//Video 18`30``

class Playlist {
  //приватне статичне поле для зберігання об'єктів Playlist
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) //генеруємо випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  //статичний метод для створення об'єкту Playlist і додавання його до списку #list
  static create(name) {
    const newPlayList = new Playlist(name)
    this.#list.push(newPlayList)
    return newPlayList
  }

  //статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    // деструктуризація: ...randomTracks, в результаті до масиву додаються одразу 3 треки
    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(playlist, id) {
    const track = Track.getById(id)
    playlist.tracks.push(track)
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))
//================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer

  const list = Playlist.getList()

  res.render('spotify-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-index',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ===============================================//
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ===============================================//

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  // console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  // console.log(req.body, req.query)

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : `/spotify-create`,
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  // console.log(playlist)

  //або на сторінку alert
  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Успішно',
      info: 'Плейліст створений',
      link: `/spotify-playlist?playlistId=${playlist.id}`, ////////////////////!!!!!!!!!!
    },
  })

  //або на одразу на сторінку з списком треків

  // return res.render('spotify-playlist', {
  //   style: 'spotify-playlist',

  //   data: {
  //     playlistId: playlist.id,
  //     tracks: playlist.tracks,
  //     name: playlist.name,
  //   },
  // })
})
// ===============================================//

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.playlistId) //////////////////////////////

  const playlist = Playlist.getById(id)

  // console.log('id', id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      image: 'https://picsum.photos/100/100',
    },
  })
})

// ===============================================//

router.get('/spotify-delete-track', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  // console.log('playlistId', 'trackId', playlistId, trackId)

  let playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks, //оновлений масив, після видалення
      name: playlist.name,
    },
  })
})

//===================
//video about "/playlist-add-track" from 32`47``

// ===============================================//

router.get('/spotify-add-track', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-add-track?playlistId=${playlistId}`,
      },
    })
  }

  res.render('spotify-add-track', {
    style: 'spotify-add-track',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
    },
  })
})

// ================//

router.post('/spotify-add-track', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.body.trackId)

  let playlist = Playlist.getById(playlistId)
  const track = Track.getById(trackId)

  // console.log(playlist)
  // console.log(track)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-add-track?playlistId=${playlistId}`,
      },
    })
  }

  playlist.addTrack(playlist, trackId)

  // console.log(playlist.tracks)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      id: track.id,
      playlistId: playlist.id,
      tracks: playlist.tracks, //оновлений масив, після додавання треку
      name: playlist.name,
    },
  })
})

// ================//

router.get('/spotify-search', function (req, res) {
  const value = ''
  // value - це назва плейліста, що вводить користувач для пошуку
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      value,
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})

// =====================//
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      value,
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})
// ===============================================//
// Підключаємо роутер до бек-енду
module.exports = router
