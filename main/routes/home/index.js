const express = require('express')
const router = express.Router()



router.all('/*' , (req,res)=>{
    // req.app.locals.t = 'home'
    res.render('home/index')
    // next()
})

// router.get('/about',(req,res)=>{
//     res.render('home/about')
// })
//
router.get('/login',(req,res)=>{
    res.render('home/login')
})

router.get('/register',(req,res)=>{
    res.render('home/register')
})

module.exports = router