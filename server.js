require('./config/database');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const indexRoute = require('./controllers/indexRoute');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/index', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// ALL SEPRATE ROUTES
app.use('/index', indexRoute); // login page and link to Sign-Up

// GET AT LOCAL HOST: /
app.get('/', (req, res) => {
	res.send('GET: main page!');
});

app.listen(PORT, () => {
	console.log('Server is running on port: ' + PORT);
});
