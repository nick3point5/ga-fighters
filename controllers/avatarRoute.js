const express = require('express');
require('body-parser');
const router = express.Router();
const db = require('../config/database');

// Avatar route ---------------------------------------------------------------
// GET   --->   /avatar index page <-----  Gets
router.get('/', (req, res) => {
	res.render('index.ejs');
});
// GET  ---->  /avatar/new  <------------   Gets Create new avatar form page
router.get('/new', (req, res) => {
	res.render('new.ejs');
});

// POST ---->   /avatar/    <---- POST =  new avatar and redirects to show
router.post('/', (req, res) => {
	console.log(req.body);

	const rb = req.body;

	db.Avatar.create(
		{
			name: rb.name,
			info: rb.info,
			stats: {
				health: rb.health,
				mana: rb.mana,
				attack: rb.attack,
				defence: rb.defence,
				spclAttack: rb.spclAttack,
				spclDefence: rb.spclDefence,
			},
			user: rb.user,
		},
		(err, newAvatar) => {
			console.log(' creating avatar');

			if (err) {
				console.log('Fuck bro');
			}

			console.log(newAvatar);
			res.redirect(`/${newAvatar._id}`);
		}
	);
});

// POST ---->   /index/:id  <-- redirects to  <---- User Login
router.post('/login', (req, res) => {
	const passW = req.body.password;
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
			if (foundObj.password === passW) {
				res.redirect(`/${foundObj._id}`);
			}
		}
	);
	// res.send('redirects to .GET  /:id');
});

// GET/Show  ---->   /index/:id    <---- Show User Profile
router.get('/:id', (req, res) => {
	const userId = req.params.id;
	db.User.findById(userId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('Profile route hit');
		res.render('index', { user: foundObj });
		// res.send('Got show profile');
	});
});

// GET ---->   /index/:id/edit    <---- User Edit Form
router.get('/:id/edit', (req, res) => {
	const userId = req.params.id;
	db.User.findById(userId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		res.render('index', { user: foundObj });
		// res.send('Get edit Form');
	});
});
// POST/PUT ---->   /index/:id    <---- User Edit/Update
router.put('/:id', (req, res) => {
	const userId = req.params.id;
	const dataObj = {
		name: req.body.name,
		password: req.body.password,
	};
	db.User.findByIdAndUpdate(
		userId,
		dataObj,
		{ new: true },
		(err, updatedObj) => {
			if (err) {
				console.log('Error:');
				console.log(err);
			}
			res.redirect(`/${updatedObj._id}`);
		}
	);
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
