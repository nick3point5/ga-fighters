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

	db.User.findOne({ account: req.params.account })
	.populate('avatars')
	.exec((err, foundObj) => {
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
	db.User.findOne({ account: req.params.account }, (err, foundObj) => {
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
	});
	
	//============================================================================================================================
	// Avatar GET index ---------------------------------------------------------------
	// GET   --->   /avatars index page <-----  Gets
	router.get('/:account/avatars', (req, res) => {

		const account = req.params.account;

		db.User.findOne({account: account})
		.populate('avatars')
		.exec((err, foundUser) => {
			console.log(foundUser)
			if (err) {
				res.send(err);
			}
			return res.render('avatar-index', { user: foundUser });
		});
	});
	
	// Avatar GET new ---------------------------------------------------------------

	router.get('/:account/new', (req, res) => {
		console.log(req.params.account)
		console.log('avatars/new  create avatar form');
		return res.render('new-avatar.ejs', { accountId: req.params.account });
		
	});
	
	// Avatar POST new ---------------------------------------------------------------
	// POST ---->   /avatars/    <---- POST =  new avatar and redirects to show
	router.post('/:account/avatars', (req, res) => {
		console.log(req.params);
		const rb = req.body;
		
		db.User.findOne({account: req.params.account},(err,foundUser)=>{
			if (err) {
				res.send(err);
			}
			db.Avatar.create(
		{
			name: rb.name,
			url: rb.img,
			info: rb.info,
			stats: {
				health: rb.health,
				mana: rb.mana,
				attack: rb.attack,
				defence: rb.defence,
				spclAttack: rb.spclAttack,
				spclDefence: rb.spclDefence,
			},
			user: foundUser._id,
		},
		(err, newAvatar) => {
			console.log(' creating avatar');
			
			if (err) {
				console.log('Fuck bro');
				res.send(err);
			}
			db.User.findByIdAndUpdate(foundUser._id,{avatars: newAvatar._id},{new:true},(err, updatedUser)=>{
				console.log(newAvatar,updatedUser);
				
				res.redirect(`/index/${updatedUser.account}/avatars`);
			})
			
			
		}
	);
})

});
// Avatar GET show ---------------------------------------------------------------

router.get('/:account/avatars/:avatarId', (req, res) => {
	const userAcc = req.params.account;
	const avatarId = req.params.avatarId;
	db.Avatar.findById(avatarId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('avatar show route hit');
		return res.render('avatarShow', { avatar: foundObj });
	});
});

// Avatar GET edit  ---------------------------------------------------------------

router.get('/:account/avatars/:avatarId/edit', (req, res) => {
	const userAcc = req.params.account;
	const avatarId = req.params.avatarId;
	db.Avatar.findById(avatarId, (err, foundObj) => {
		if (err) {
			res.send(err);
		}
		console.log('avatar edit page', foundObj);
		res.render('avatarEdit', { avatar: foundObj });
	});
});

// Avatar POST update  ---------------------------------------------------------------
router.put('/:account/avatars/:avatarId', (req, res) => {
	console.log(req.body);
	const password = req.body.password;
	const userAcc = req.params.account;
	const avatarId = req.params.avatarId;
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
		db.User.findOne({account:userAcc},(err, foundUser)=>{
			if (err) {
				res.send(err);
			}
			if(foundUser.password === password){
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
				return res.redirect(`/index/${userAcc}/avatars/${avatarId}`);
			}
			);
			}else{
				return res.redirect(`/index/${userAcc}/avatars/${avatarId}/edit`)
			}
			
		})
		
	});
	
	router.delete('/:account/avatars/:avatarId', (req, res) => {
		const userAcc = req.params.account
		const avatarId = req.params.avatarId
		db.Avatar.findByIdAndDelete(avatarId,(err,deletedAvatar)=>{
			if (err) {
				res.send(err);
			}
			
			return res.redirect(`/index/${userAcc}/avatars`)
	})
	
});

	//============================================================================================================================
	
	module.exports = router;