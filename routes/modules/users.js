const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, ConfirmPassword } = req.body
  User.findOne({ email }).then(user => {
    if (user) {
      console.log('user already exists')
      res.render('register', { name, email, password, ConfirmPassword })
    } else {
      return User.create({
        name, email, password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
