const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const Campground = require('./models/campground')


mongoose.connect('mongodb://127.0.0.1:27017/pasan-camps')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch((err) => {
        console.log("OH NO MONGO CONNECTION ERROR!!!")
        console.log(err)
    });   

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makeCamp', async (req, res) => {
    // await Campground.create({title: 'My Backyard', description: 'cheap camping!'})
    res.send('Done')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
});