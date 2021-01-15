require('./config/database');
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const controller = require('./controllers/controllers')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use('/index',express.static(__dirname+'/public'))
app.set('view engine', 'ejs')
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
});

app.use('/index', controller)



