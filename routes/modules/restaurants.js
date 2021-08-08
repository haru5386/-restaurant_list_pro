const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()


//載入資料
const Restaurant = require('../../models/restaurant')

// 新增功能
router.get('/new', (req, res) => {
  return res.render('new')
})


// 搜尋功能
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then((restaurants) => {
      let restaurantSearch = restaurants.filter((restaurant) => {
        return restaurant.name.toLocaleLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLocaleLowerCase().includes(keyword.toLowerCase())
      })
      res.render('index', { restaurant: restaurantSearch, keyword })
    })
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

router.get('/:restaurant_id', [
  check('restaurant_id', '查無此ID').isMongoId()
], (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const alert = errors.array()
    return res.status(422).render('errorID', { alert: alert[0] })
  }
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})



// 接住新增的資料
router.post('/', [
  check('name', '請輸入1~20的字位元')
    .isLength({ min: 1, max: 20 }),
  check('category', '請選擇分類')
    .not().isEmpty(),
  check('image', '請輸入圖片網址')
    .not().isEmpty(),
  check('rating', '請輸入1~5的評分')
    .isFloat({ min: 1, max: 5 }),
  check('location', '請輸入地址')
    .not().isEmpty(),
  check('phone', '請輸入手機')
    .not().isEmpty(),
  check('description', '請輸入描述')
    .not().isEmpty(),
], (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, image, rating, location, phone, description } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const alert = errors.array()
    return res.status(422).render('new', { alert, name, name_en, category, image, rating, location, phone, description })
  }
  return Restaurant.create({ name, name_en, category, image, rating, location, phone, description, userId })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 編輯資料
router.get('/:restaurant_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  const category = {
    Italy: false,
    Amer: false,
    Bar: false,
    Japan: false,
    Coffee: false,
    Middleeast: false
  }
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => {
      if (restaurant.category === '義式餐廳') {
        category.Italy = true
      } else if (restaurant.category === '美式') {
        category.Amer = true
      } else if (restaurant.category === '酒吧') {
        category.Bar = true
      } else if (restaurant.category === '日本料理') {
        category.Japan = true
      } else if (restaurant.category === '咖啡') {
        category.Coffee = true
      } else if (restaurant.category === '中東料理') {
        category.Middleeast = true
      }
      console.log(restaurant.category === '中東料理')
      res.render('edit', { restaurant, category })
    })
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

router.put('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  const { name, name_en, category, image, rating, location, phone, description } = req.body
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.rating = rating
      restaurant.location = location
      restaurant.phone = phone
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 刪除
router.delete('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      // console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

module.exports = router