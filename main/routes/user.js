const express = require('express')
const router = express.Router()
const Post = require('../../models/Post')
const {isEmpty,uploadDir} =require('../../helpers/upload-helper')
const fs = require('fs')


router.all('/*' , (req,res,next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/',(req,res)=>{

    Post.find({}).lean().then(posts=>{
        res.render('admin/posts',{posts:posts})
    })

})

router.get('/create',(req,res)=>{
    res.render('admin/posts/create')
})

router.post('/create',(req,res)=>{

    let err= []

    if(!req.body.title){
        err.push({message: 'please add a title'})
    }


    if(!req.body.body){
        err.push({message: 'please add a description'})
    }

    if(err.length>0){
        res.render('admin/posts/create',{
            err: err
        })
    } else {
        let filename = ''
        if (!isEmpty(req.files)) {
            let file = req.files.file
            filename = Date.now() + '-' + file.name

            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err

            })
        }

//  console.log(req.files)
        let allowComments = true

        if (req.body.allowComments) {
            allowComments = true
        } else {
            allowComments = false
        }

        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            file: filename
        })

        newPost.save().then(savedPost => {

            // console.log(savedPost)

            res.redirect('/admin/posts')
        }).catch(err => {
            console.log(err,'could not save post')
        })

    }

})




router.get('/edit/:id',(req,res)=>{

    Post.findOne({_id: req.params.id}).lean().then(post=>{
        res.render('admin/posts/edit',{post:post})
    })

})


router.put('/edit/:id',(req,res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{

            if(req.body.allowComments) {
                allowComments = true
            } else{
                allowComments = false
            }


            post.title = req.body.title
            post.status = req.body.status
            post.allowComments = allowComments
            post.body = req.body.body

            post.save().then(updatedPost=>{
                res.redirect('/admin/posts')
            })
        })
})

//delete post
// router.delete('/:id',(req,res)=>{
//     Post.remove({_id: req.params.id})
//         .then(result=>{
//             res.redirect('/admin/posts')
//         })
// })


//delete file with post
router.delete('/:id',(req,res)=> {
    req.flash = function (successMessage, postWasSuccessfullyDeleted) {

    }
    Post.findOne({_id: req.params.id})
        .then(post => {

            fs.unlink(uploadDir + post.file, (err) => {

                post.remove()

                req.flash('success_message', 'Post was successfully deleted')
                res.redirect('/admin/posts')
            })
        })
})

module.exports = router