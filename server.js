require('./config/database');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session')
const app = express();
const ejs = require('ejs');
const indexRoute = require('./controllers/indexRoute.js');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use((req,res,next)=>{
	next()
})
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public/assets'));
app.use(session({
	secret: 'clifford the big red dog',
	resave: false,
	saveUninitialized: false,
	cookie: {
	  maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // valid for 2 weeks
	}
}));

// GET AT LOCAL HOST: /
app.get('/', (req, res) => {
	res.render('index');
}); 

// ALL SEPRATE ROUTES
app.use('/index', express.static(__dirname + '/public'));
app.use('/index', indexRoute); // login page and link to Sign-Up
app.listen(PORT, () => {
	console.log('Server is running on port: ' + PORT);
});
