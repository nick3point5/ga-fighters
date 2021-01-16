require('../config/database');
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// User route ---------------------------------------------------------------
// GET   --->   /index <-----  Gets -> Login form and sign-up page link
router.get('/', (req, res) => {
	res.render('index.ejs');
});
// GET  ---->  /index/new  <------------   Gets Create new user form page
router.get('/new', (req, res) => {
	res.render('new.ejs');
});

// POST ---->   /index/    <---- User Sign up and redirects to login
router.post('/', (req, res) => {
	const dataObj = {
		name: req.body.name,
		password: req.body.password,
	};

	db.User.create(dataObj, (err) => {
		if (err) {
			res.send(err);
		}
		res.redirect('/');
	});
});

// POST ---->   /index/:id  <-- redirects to  <---- User Login
router.post('/login', (req, res) => {
	db.User.findOne(
		{
			name: req.body.name,
		},
		(err, foundObj) => {
			if (err) {
				res.send(err);
			}
			if (!foundObj === '') {
				return res.send('error finding user during login');
			}
			if (foundObj.password === req.body.password) {
				res.redirect(`/${foundObj._id}`);
			}
		}
	);
	// res.send('redirects to .GET  /:id');
});

// GET/Show  ---->   /index/:id    <---- Show User Profile
router.get('/:id', (req, res) => {
	const userId = req.params.id;
	db.User.findById(userId)
		.populate('avatars')
		.excu((err, foundObj) => {
			if (err) {
				res.send(err);
			}
			// res.render('index', { user: foundObj });
			res.send('Get show profile');
		});
});
// GET ---->   /index/:id/edit    <---- User Edit Form
router.get('/:id/edit', (req, res) => {
	const userId = req.params.id;
	db.User.findById(userId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		// res.render('index', { user: foundObj });
		res.send('Get edit Form');
	});
});
// POST/PUT ---->   /index/:id    <---- User Edit/Update
router.put('/:id', (req, res) => {
	const userId = req.params.id;
	db.User.findByIdAndUpdate(
		req.body.id,
		updateObj,
		{ new: true },
		(err, obj) => {
			if (err) {
				console.log('Error:');
				console.log(err);
			}
		}
	);
});

router.delete('/:id', (req, res) => {
	Model.findByIdAndDelete(req.body.id, (err, obj) => {
		if (err) {
			console.log('Error:');
			console.log(err);
		}
	});
});

module.exports = router;
