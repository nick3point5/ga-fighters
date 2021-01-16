const express = require('express');
const app = express();
require('./config/database');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const indexRoute = require('./controllers/indexRoute.js');
const avatarRoute = require('./controllers/avatarRoute.js');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use((req, res, next) => {
	next();
});
// app.use('/index', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// GET AT LOCAL HOST: /
app.get('/', (req, res) => {
	res.render('index');
});
// ALL SEPRATE ROUTES
app.use('/index', indexRoute); // login page and link to Sign-Up
app.use('/avatars', avatarRoute); // Avatar index page and link to Create avatar
app.listen(PORT, () => {
	console.log('Server is running on port: ' + PORT);
});
