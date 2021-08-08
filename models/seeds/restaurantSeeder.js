const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const restaurants = require('./restaurant.json').results
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_USER = [{
  email: 'user1@example.com',
  password: '12345678',
  restaurantId: [1, 2, 3]
}, {
  email: 'user2@example.com',
  password: '12345678',
  restaurantId: [4, 5, 6]
}]

db.once('open', () => {
  Promise.all(Array.from(SEED_USER, (SEED_USER, i) => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({ email: SEED_USER.email, password: hash }))
      .then(user => {
        const userId = user._id
        const haveRestaurants = restaurants.filter(restaurant => SEED_USER.restaurantId.includes(restaurant.id))
        haveRestaurants.forEach(restaurant => restaurant.userId = userId)
        return Restaurant.create(haveRestaurants)
      })
  }))
    .then(() => {
      console.log('seeder done!')
      process.exit()
    })
    .catch(error => console.log(error))
})