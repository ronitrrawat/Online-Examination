const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/register',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(()=>{
    console.log('database connected')
}).catch((e)=>{
    console.log('database not connected')
})
