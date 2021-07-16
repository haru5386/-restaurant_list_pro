const express = require('express')
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
  Restaurant.find()
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

router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})



// 接住新增的資料
router.post('/', (req, res) => {
  const { name, name_en, category, image, rating, location, phone, description } = req.body
  return Restaurant.create({ name, name_en, category, image, rating, location, phone, description })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 編輯資料
router.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  const category = {
    Italy: false,
    Amer: false,
    Bar: false,
    Japan: false,
    Coffee: false,
    Middleeast: false
  }
  return Restaurant.findById(id)
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
  const id = req.params.restaurant_id
  const { name, name_en, category, image, rating, location, phone, description } = req.body
  return Restaurant.findById(id)
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
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 刪除
router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  console.log(id)
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

module.exports = router