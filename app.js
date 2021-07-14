const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

//載入資料
const Restaurant = require('./models/restaurant')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 連線mongoose
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected')
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 1 })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

app.post('/', (req, res) => {
  const sort = req.body.sort
  let Sort = '_id: 1'
  if (sort === 'AtoZ') {
    Sort = { name: 1 }
    console.log(Sort)
  } else if (sort === 'ZtoA') {
    Sort = { name: -1 }
  } else if (sort === 'category') {
    Sort = { category: 1 }
  } else if (sort === 'location') {
    Sort = { location: 1 }
  }

  Restaurant.find()
    .lean()
    .sort(Sort)
    .then(restaurant => res.render('index', { restaurant, Sort }))
    .catch(error => console.error(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 搜尋功能
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      let restaurantSearch = restaurants.filter((restaurant) => {
        return restaurant.name.toLocaleLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLocaleLowerCase().includes(keyword.toLowerCase())
      })
      res.render('index', { restaurant: restaurantSearch, keyword })
    })
})

// 新增功能
app.get('/restaurant/new', (req, res) => {
  return res.render('new')
})

// 接住新增的資料
app.post('/restaurant', (req, res) => {
  const { name, name_en, category, image, rating, location, phone, description } = req.body
  return Restaurant.create({ name, name_en, category, image, rating, location, phone, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 編輯資料
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
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
    .catch(error => console.log(error))
})

// 刪除
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})