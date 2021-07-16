
const express = require('express')
const router = express.Router()

//載入資料
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const sort = req.query.sort
  let Sort = { _id: 1 }
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
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})


module.exports = router