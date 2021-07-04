const express = require('express')
const app = express()
const port = 3000

const restaurantList = require('./restaurant.json')

const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurants => {
    return restaurants.name.toLocaleLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurant: restaurants, keyword })
})
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.filter(item => item.id == req.params.restaurant_id)
  res.render('show', { restaurant: restaurant[0] })
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})