const express = require('express');
const mongoose = require('mongoose');
require('body-parser');
const router = express.Router();
const db = require('../config/database');
// User route ---------------------------------------------------------------
// GET   --->   /index <-----  Gets -> Login form and sign-up page link
router.get('/', (req, res) => {
	res.render('index');
});
// GET  ---->  /index/new  <------------   Gets Create new user form page
router.get('/new', (req, res) => {
	res.render('new');
});

// POST ---->   /index/    <---- User Sign up and redirects to login
router.post('/', (req, res) => {
	console.log('In POST create User route.');
	if (req.body.password === req.body.confirm) {
		db.User.create(
			{
				name: req.body.name,
				password: req.body.password,
				account: mongoose.Types.ObjectId(),
			},
			(err, newUser) => {
				console.log(req.body.name);
				if (err) {
					console.log('Fuck bro');
				}
				console.log(newUser);
				res.render('index');
			}
		);
	} else {
		res.redirect('/new');
	}
});

// POST ---->   /index/:id  <-- redirects to  <---- User Login
router.post('/login', (req, res) => {
	console.log(req.body);

	db.User.findOne({ name: req.body.name }, (err, foundObj) => {
		const user = foundObj;
		if (err) {
			return res.send(err);
		}
		if (user.password === req.body.password) {
			console.log('user logged in.... Yeppy!!');
			res.redirect(`/index/${foundObj.account}`);
		} else {
			console.log('Incorrect password.');
			res.redirect('/');
		}
	});
});

// GET/Show  ---->   /index/:id    <---- Show User Profile
router.get('/:account', (req, res) => {
	db.User.findOne({ account: req.params.account }, (err, foundObj) => {
		console.log(foundObj);
		if (err) {
			res.send(err);
		}
		console.log('Profile route hit');
		res.render('show', { user: foundObj });
		// res.send('Got show profile');
	});
});

// GET ---->   /index/:id/edit    <---- User Edit Form
router.get('/:account/edit', (req, res) => {
	const userAcc = req.params.account;
	db.User.findOne({ account: userAcc }, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		res.render('edit', { user: foundObj });
		// res.send('Get edit Form');
	});
});
// POST/PUT ---->   /index/:id    <---- User Edit/Update
router.put('/:account', (req, res) => {
	const dataObj = {
		newName: req.body.newName,
		currPassword: req.body.currPassword,
		newPassword: req.body.newPassword,
		confirm: req.body.confirm,
		// updated info var
		name: req.body.newName,
		password: req.body.newPassword,
	};

	db.User.findOne({ account: req.params.account }, (err, foundUser) => {
		if (err) {
			console.log(err);
		}
		if (foundUser.password === dataObj.currPassword) {
			if (dataObj.newPassword === dataObj.confirm) {
				db.User.findByIdAndUpdate(
					foundUser._id,
					{ name: dataObj.name, password: dataObj.password },
					{ new: true },
					(err, updatedObj) => {
						if (err) {
							console.log('Error:');
							console.log(err);
						}
						console.log('Updated user :', updatedObj);
						res.redirect(`/index/${updatedObj.account}`);
					}
				);
			} else {
				console.log('edit user failed new passwords dont match confirmation');
				return res.render('edit', { user: foundUser });
			}
		} else {
			console.log('edit user failed passwords incorrect');
			return res.render('edit', { user: foundUser });
		}
	});
});

router.delete('/:id', (req, res) => {
	const userId = req.params.id;
	db.User.findByIdAndDelete(userId, (err, deletedObj) => {
		if (err) {
			console.log('Error:');
			console.log(err);
		}

		res.redirect('/');
	});
});

module.exports = router;
