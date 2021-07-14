
const Restaurant = require('../restaurant')
const raw = require('./restaurant.json')
const restaurants = raw.results


const db = require('../../config/mongoose')

db.once('open', () => {
  for (restaurant of restaurants) {
    Restaurant.create({
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  }
  console.log('done')
})