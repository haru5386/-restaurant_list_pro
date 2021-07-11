const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

TODO:
//要拿掉的資料
// const restaurantList = require('./restaurant.json')

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
app.get('/', (req, res) => {
  res.send('hi')
  // res.render('index', { restaurant: restaurantList.results })
})

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const restaurants = restaurantList.results.filter(restaurants => {
//     return restaurants.name.toLocaleLowerCase().includes(keyword.toLowerCase()) && restaurants.category.toLocaleLowerCase().includes(keyword.toLowerCase())
//   })
//   res.render('index', { restaurant: restaurants, keyword })
// })
// app.get('/restaurants/:restaurant_id', (req, res) => {
//   const restaurant = restaurantList.results.filter(item => item.id == req.params.restaurant_id)
//   res.render('show', { restaurant: restaurant[0] })
// })

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})