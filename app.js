const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

let date_ob = new Date();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//database connection
mongoose.connect("mongodb://localhost:27017/blog_site", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const blog = new mongoose.Schema(
    {
        name: String,
        image: String,
        time: String,
        description: String
    }
);

const Blog = mongoose.model("Blog", blog);

app.get("/", (req, res) => {
    res.send("This is the root route");
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) console.log(err)
        else res.render('index', {blogs: blogs})
    })
})

app.post('/blogs', (req, res) => {
    console.log(req.body)
    const timestamp = date_ob.toLocaleDateString() +" " + date_ob.getHours()+":" +date_ob.getMinutes();
    Blog.create(
        {
            name: req.body.name,
            image: req.body.image,
            time: timestamp,
            description: req.body.description
        }
    )
    res.redirect('/blogs')
})

app.get('/blogs/new', (req, res) => {
    res.render('new')
})

app.get('/blogs/:id',(req, res) => {
    Blog.findById(req.params.id,(err,blog)=>{
        if(err) console.log(err)
        else res.render('more_info',{blog:blog})
    })
})

app.delete('/blogs/:id',(req, res) => {
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err) res.redirect('/blogs')
        else res.redirect('/blogs')
    });
})

app.get('/blogs/:id/edit',((req, res) => {
    Blog.findById(req.params.id,(err,blog)=>{
        if(err) res.redirect('/blogs/:id')
        else res.render('edit',{blog: blog})
    })
}))

app.put('/blogs/:id/edit',(req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    Blog.findById(req.params.id,(err,blog)=>{
        if(err) res.redirect('blogs/:id');
        Blog.findByIdAndUpdate(req.params.id,{$set: {name: name, image: image,description: description}},(err =>{
            if (err) console.log(err)
            res.redirect('/blogs/'+req.params.id)
        } ))
    })
})

app.listen(3001, () => {
    console.log("SERVER STARTED")
})