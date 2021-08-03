const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
const hbs = require('hbs')
const bcrypt = require('bcryptjs')

require('./db/conn')



require('./db/conn')
const Register = require("./models/register")
const {json} = require("express")



const template_path = path.join(__dirname,"./views")
const  partials_path = path.join(__dirname,"./partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, 'public')))

//Set View engine
app.engine('handlebars',exphbs('home'))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)


// //Load
// // const users = require('')
// const home = require('./routes/home')
// //Use Routes
// app.use('/',home)

app.get("/",(req,res)=>{
    res.render("main")
})

app.get("/adminDashboard",(req,res)=>{
    res.render("adminDashboard",console.log(email))
})

app.get("/viewStudents",(req,res)=>{
    res.render("viewStudents")
})


app.get("/adminprofile",(req,res)=>{
    res.render("adminprofile")

})

app.get("/createexam",(req,res)=>{
    res.render("createExam")
})

app.get("/studentDashboard",(req,res)=>{
    res.render("studentDashboard")
})

app.get('/logout',(req,res)=>{
    res.render("main")
})



 var count = 0
app.post("/register",async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.confirmpassword


        if (password === cpassword) {
            if(count === 0) {

            const registerStudent = new Register({
                name: req.body.name,
                email: req.body.email,
                MobileNumber: req.body.mobilenumber,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                address: req.body.address,
                role: "admin"
            })
            count++;

            const registered = await registerStudent.save()
            res.status(201).render('main',{})
        }   else {
                 const registerStudent = new Register({
                     name: req.body.name,
                                email: req.body.email,
                                MobileNumber: req.body.mobilenumber,
                                password: req.body.password,
                                confirmpassword: req.body.confirmpassword,
                                address: req.body.address,
                                role: "student"
                            })
                            const registered = await registerStudent.save()
                       res.status(201).render('main',{})
                }
                
        } else {
            res.send("password are not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})


 
    

app.get('/admin',(req,res) =>{
    res.render('admin')
})


app.get('/login',(req,res)=>{
    res.render("login")
})

//login check
app.post('/login',async (req,res)=>{
    try{

        const email = req.body.email
        const password = req.body.password

        const useremail = await Register.findOne({email:email})
        console.log(useremail.role)
        const name = useremail.name
        const mobile = useremail.mobile
        const address = useremail.address
        console.log({name,email,mobile,address})
         //res.send(useremail.password)

        const isMatch = await bcrypt.compare(password,useremail.password)
        if(isMatch && useremail.role === "student"){
          res.status(401).render("studentDashboard",{name,email,mobile,address})
       }
       if(isMatch && useremail.role === "admin"){
        res.status(401).render("adminDashboard",{name,email,mobile,address})
     }


    } catch (error){
        res.status(400).send("invalid login details")
    }
})


app.get('/resetpass',(req,res) =>{
    res.render('Resetpass')
})

app.get('/otp',(req,res) =>{
    res.render('otp')
})



app.listen(1000,()=>{
    console.log('listening on port 1000')
})