const express = require('express');
require('body-parser');
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
	console.log(req.body.name);
	if(req.body.password===req.body.confirm){
		db.User.create(
			{
				name: req.body.name,
				password: req.body.password,
			},
			(err, newUser) => {
				console.log(req.body.name);
				if (err) {
					console.log('Fuck bro');
				}
				console.log(newUser);
				res.redirect('/index');
			}
		);
	} else {
		res.send('User not created wrong password.');
		// res.redirect('/new');
	}
});

// POST ---->   /index/:id  <-- redirects to  <---- User Login
router.post('/login', (req, res) => {
	const userName = req.body.name;
	const passW = req.body.password;
	db.User.findOne({ name: userName }, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		if (!foundObj) {
			return res.send('error finding user during login');
		}
		if (foundObj.password === passW) {
			console.log('user logged in.... Yeppy!!');
			res.redirect(`${foundObj._id}`);
		} else {
			console.log('Incorrect password.');
			return res.redirect('/');
		}
	});
});

// GET/Show  ---->   /index/:id    <---- Show User Profile
router.get('/:id', (req, res) => {
	const userId = req.params.id;
	db.User.findById(userId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('Profile route hit');
		res.render('show', { user: foundObj });
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
		res.render('edit', { user: foundObj });
		// res.send('Get edit Form');
	});
});
// POST/PUT ---->   /index/:id    <---- User Edit/Update
router.put('/:id', (req, res) => {
	userId = req.params.id;

	const dataObj = {
		newName: req.body.newName,
		currentPassword: req.body.currentPassword,
		newPassword: req.body.newPassword,
		confirmation: req.body.confirmation,
		// updated info var
		name: req.body.newName,
		password: req.body.newPassword,
	};
	if(req.body.password===req.body.confirm){
	db.User.findByIdAndUpdate(
		userId,
		dataObj,
		{ new: true },
		(err, updatedObj) => {
			if (err) {
				console.log('Error:');
				console.log(err);
			}
			res.redirect(`/index/${updatedObj._id}`);
		}
	);
	}else{
		res.send('passwords not matching')
	}
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

//ANCHOR //	Avatar routes		///////////////////////////////////////

router.get('/:id/avatars/', (req, res) => {
	console.log('in avatar index');
	res.render('show.ejs');
});
// GET  ---->  /avatars/new  <------------   Gets Create new avatar form page
router.get('/:id/avatars/new', (req, res) => {
	console.log('avatars/new  create avatar form');
	// console.log(req.params.id);
	res.render('new-avatar',{accountId: req.params.id});
});

// POST ---->   /avatars/    <---- POST =  new avatar and redirects to show
router.post('/:id/avatars/', (req, res) => {
	console.log(req.body);
	const userId = req.params.id;

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
			res.redirect(`/`);
		}
	);
});

// GET/Show  ---->   /index/:id    <---- Show User Profile
router.get('/:id/avatars/:avatarId', (req, res) => {
	const userId = req.params.id;
	const avatarId = req.params.avatarId;
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
router.get('/:id/avatars/:avatarId/edit', (req, res) => {
	const userId = req.params.id;
	const avatarId = req.params.avatarId;
	db.Avatar.findById(avatarId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('avatar edit page', foundObj);
		res.render('index', { avatar: foundObj });
		// res.send('Get edit Form');
	});
});
// POST/PUT ---->   /:id    <---- User Edit/Update
router.put('/:id/avatars/:id', (req, res) => {
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

router.delete('/:id/avatars/:id', (req, res) => {
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