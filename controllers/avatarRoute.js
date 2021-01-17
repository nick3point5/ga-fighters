const express = require('express');
require('body-parser');
const router = express.Router();
const db = require('../config/database');

// Avatar route ---------------------------------------------------------------
// GET   --->   /avatars index page <-----  Gets
router.get('/', (req, res) => {
	console.log('in avatar index');
	res.render('index.ejs');
});
// GET  ---->  /avatars/new  <------------   Gets Create new avatar form page
router.get('/new', (req, res) => {
	console.log('avatars/new  create avatar form');
	res.render('new.ejs');
});

// POST ---->   /avatars/    <---- POST =  new avatar and redirects to show
router.post('/', (req, res) => {
	console.log(req.params);
	const userId = req.params._id;

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
			user: userId,
		},
		(err, newAvatar) => {
			console.log(' creating avatar');

			if (err) {
				console.log('Fuck bro');
			}

			console.log(newAvatar);
			res.redirect('/');
		}
	);
});

// GET/Show  ---->   /index/:id    <---- Show User Profile
router.get('/:avatarId', (req, res) => {
	const userId = req.params._id;
	const avatarId = req.params._avatarId;
	db.Avatar.findById(avatarId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('avatar show route hit');
		res.render('index', { avatar: foundObj });
		// res.send('Got show profile');
	});
});

// GET ---->   /index/:id/edit    <---- User Edit Form
router.get('/:avatarId/edit', (req, res) => {
	const userId = req.params._id;
	const avatarId = req.params._avatarId;
	db.Avatar.findById(avatarId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('avatar edit page', foundObj);
		res.render('index', { avatar: foundObj });
		// res.send('Get edit Form');
	});
});
// POST/PUT ---->   /avatars/:avatarId    <---- User Edit/Update
router.put('/:avatarId', (req, res) => {
	console.log(req.body);
	const avaPassword = req.body.password;
	const userId = req.params._id;
	const avatarId = req.params._avatarId;
	const rb = req.body;
	const updateObj = {
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
	};
	db.Avatar.findByIdAndUpdate(
		avatarId,
		updateObj,
		{ new: true },
		(err, updatedAvatar) => {
			if (err) {
				console.log('Error:');
				console.log(err);
				res.send(err);
			}
			console.log('updated avatar: ', updatedAvatar);
			res.redirect(`/${updatedAvatar._id}`);
		}
	);
});

router.delete('/:avatarId', (req, res) => {
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
