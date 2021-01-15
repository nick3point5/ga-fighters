require('../config/database');
const express = require('express');
const router = express.Router();
const db = require('../models/User');

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

	db.User.create(objData, (err, obj) => {
		if (err) {
			res.send(err);
		}
		res.redirect('/');
	});
});

// POST ---->   /index/:id    <---- User Login
router.post('/login', (req, res) => {
	db.User.findOne(
		{
			name: req.body.name,
		},
		(err, foundObj) => {
			if (err) {
				res.send(err);
			}
			if (!foundObj) {
				return res.redirect('/');
			}
			if (foundObj.password === req.body.password) {
				return res.redirect(`/${foundObj._id}`);
			}
		}
	);
});

// POST/PUT ---->   /index/:id    <---- User Edit
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
