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
				if (err) {
					console.log('Fuck bro');
				}
				res.redirect('/index');
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
		console.log(foundObj);
		if (err) {
			return res.send(err);
		}
		if (foundObj === null) {
			console.log('User not found');
			res.redirect('/');
		} else if (foundObj.password !== req.body.password) {
			console.log('Incorrect password.');
			res.redirect('/');
		} else {
			console.log('user logged in.... Yeppy!!');
			res.redirect(`/index/${foundObj.account}`);
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
//============================================================================================================================
//             -->  Avatar New <--
// GET  ---->  /:account/new  <------------   Gets Create new avatar form page
router.get('/:account/new', (req, res) => {
	console.log('avatars/new  create avatar form');
	db.User.findOne({ account: req.params.account }, (err, foundUser) => {
		res.render('new-avatar.ejs', { user: foundUser });
	});
});
//============================================================================================================================

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
			console.log('Error:');
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
		console.log('avatar edit page', foundObj);
		res.render('index', { avatar: foundObj });
		// res.send('Get edit Form');
	});
});



router.delete('/:account', (req, res) => {
	const userAcc = req.params.account;
	db.User.findOne({ account: userAcc }, (err, foundObj) => {
		if (err) {
			console.log('Error:');
			console.log(err);
		}
		db.User.findByIdAndDelete(foundObj._id, (err, deletedObj) => {
			if (err) {
				return res.send(err);
			}
			console.log(deletedObj);
			res.redirect('/');
		});
	});
}); */


module.exports = router;