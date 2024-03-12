const express = require('express')
const app = express()
const PORT = 3000
const fs = require('fs')

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/create', (req, res) =>
{
    res.render('create')
})
app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description
  
    if (title.trim() === '' && description.trim() === '') {
      res.render('create', { error: true })
    } else {
      fs.readFile('./public/data/data.json', (err, data) => {
        if (err) throw err
  
        const blogs = JSON.parse(data)
  
        blogs.push({
          id: id(),
          title: title,
          description: description,
        })
  
        fs.writeFile('./public/data/data.json', JSON.stringify(blogs), err => {
          if (err) throw err
  
          res.render('create', { success: true })
        })
      })
    }
  })
  

app.get('/blogs', (req, res) =>
{
    fs.readFile('./public/data/data.json', (err,data) => {
        if(err) throw err

        const blogs = JSON.parse(data)

        res.render('blogs', {blogs: blogs})
    })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id
     
    fs.readFile('./public/data/data.json', (err, data) => {
      if (err) throw err
      const blogs = JSON.parse(data)
      const blog = blogs.filter(blog => blog.id == id)[0]
      res.render('detail', { blog: blog })
    })
  })

app.listen(PORT, (err) => {
    if (err) throw err

    console.log('this nodes app use' + PORT)
})


function id() {
    return '_' + Math.random().toString(36).substring(2, 9);
};

app.get('/:id/delete', (req, res) => {
    const id = req.params.id
  
    fs.readFile('./public/data/data.json', (err, data) => {
      if (err) throw err
  
      const blogs = JSON.parse(data)
      const filteredBlogs = blogs.filter(blog => blog.id !== id)
  
      fs.writeFile('./public/data/data.json', JSON.stringify(filteredBlogs), err => {
        if (err) throw err
  
        res.render('home', { blogs: filteredBlogs, delete: true })
      })
    })
  })
  