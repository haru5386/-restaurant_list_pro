const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, ConfirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !ConfirmPassword) {
    errors.push({ message: '所有欄位都是必填的' })
  }
  if (password !== ConfirmPassword) {
    errors.push({ message: '確認密碼不相符' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, ConfirmPassword })
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: 'user already exists' })
      res.render('register', { errors, name, email, password, ConfirmPassword })
    } else {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name, email, password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出！')
  res.redirect('/users/login')
})

module.exports = router
