const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema
({
    role: {
        type: String,
        required:true,
        trim: true,
        default: 'student'
    },
     name:{
        type: String,
        required:true,
        trim: true,

    },
    MobileNumber:{
        minlength:10,
        type: Number,
        trim: true,
        default: 0,
        

    },
    address:{
        type: String,
        trim: true,
        default: 0,

    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim:true,
        validate(value)
        {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required:true,
        }
    }],
}, {
    timestamps: true
})
//hidingPrivateData
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens


    return userObject
}

//instanceMethods
userSchema.methods.generateAuthToken =
    async function(){
        const user = this
        const token = jwt.sign({_id: user._id.toString() },process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
    }
//modelMethods
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await Register.findOne({email})
    if(!user)
    {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error ('unable to login')
    }
    return user
}

//Hash plan text password before saving
userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const Register = mongoose.model("Register",userSchema)
module.exports = Register