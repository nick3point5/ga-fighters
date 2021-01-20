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

	db.User.findOne({ name: req.body.name }, (err, foundObj) => {
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
		if (err) {
			res.send(err);
		}
		
		res.render('show', { user: foundObj });
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
				res.redirect('/');
			});
		});
	});
	
	//============================================================================================================================
	// Avatar GET index ---------------------------------------------------------------
	// GET   --->   /avatars index page <-----  Gets
	router.get('/:account/avatars', (req, res) => {

		const accountId = req.params.account;

		db.User.findOne({ account : accountId})
		.populate('avatars')
		.exec((err, foundUser) => {
			if (err) {
				res.send(err);
			}
			return res.render('show', { user: foundUser });
		});
	});
	
	// Avatar GET new ---------------------------------------------------------------

	router.get('/:account/new', (req, res) => {
		return res.render('new-avatar.ejs', { accountId: req.params.account });
		
	});
	
	// Avatar POST new ---------------------------------------------------------------
	// POST ---->   /avatars/    <---- POST =  new avatar and redirects to show
	router.post('/:account/avatars', (req, res) => {
		const rb = req.body;
		
		db.User.findOne({account: req.params.account},(err,foundUser)=>{
			if (err) {
				res.send(err);
			}
			db.Avatar.create(
		{
			name: rb.name,
			img: rb.img,
			info: rb.info,
			stats: {
				health: rb.health,
				mana: rb.mana,
				attack: rb.attack,
				defence: rb.defence,
				spclAttack: rb.spclAttack,
				spclDefence: rb.spclDefence,
			},
			exp: 50,
			user: foundUser._id,
		},
		(err, newAvatar) => {
			
			if (err) {
				console.log('Fuck bro');
				res.send(err);
			}
			db.User.findByIdAndUpdate(foundUser._id,{$push:{avatars: newAvatar._id}},{new:true},(err, updatedUser)=>{				
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
		let lvl = 1
		if (foundObj.stats.exp>=100){
			lvl = Math.floor(Math.log(9*(foundObj.stats.exp)/100)/Math.log(3))
		}

		let expRem = (3**(lvl-1))*100 - foundObj.stats.exp 
		console.log(foundObj.stats.exp)
		return res.render('avatar-Show', { avatar: foundObj, userAcc: userAcc, levelInfo:{lvl:lvl, expRem:expRem}});
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
		let lvl = 1
		if (foundObj.stats.exp>=100){
			lvl = Math.floor(Math.log(9*(foundObj.stats.exp)/100)/Math.log(3))
		}
		let spent = (
			foundObj.stats.health/20+
			foundObj.stats.mana/20+
			foundObj.stats.attack+
			foundObj.stats.defence+
			foundObj.stats.spclAttack+
			foundObj.stats.spclDefence
		)


		const skillpts = 20 * lvl + 30 - spent

		

		return res.render('avatar-edit', { avatar: foundObj , avatarId : avatarId, accountId: userAcc, skillpts: skillpts, lvl:lvl});
	});
});
// Avatar GET game  ---------------------------------------------------------------

router.get('/:account/avatars/:avatarId/game', (req, res) => {
	const userAcc = req.params.account;
	const avatarId = req.params.avatarId;
	db.Avatar.findById(avatarId, (err, player) => {
		if (err) {
			res.send(err);
		}
		db.Avatar.find({user: {$nin:player.user}}, (err, opponents) => {
			if (err) {
				res.send(err);
			}
			const pick = getRand(opponents.length-1,0)
			const opponent = (opponents[pick])
			
			return res.render('game', { avatar: player , avatarId : avatarId, accountId: userAcc, opponent:opponent});
		})

	});
});

// Avatar POST update  ---------------------------------------------------------------
router.put('/:account/avatars/:avatarId', (req, res) => {
	const userAcc = req.params.account;
	const avatarId = req.params.avatarId;
	const rb = req.body;
		db.Avatar.findById(avatarId,(err, foundAvatar)=>{
			if (err) {
				res.send(err);
			}

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
					exp: foundAvatar.stats.exp
				},
				user: foundAvatar.user, 
				img: rb.img,
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
				return res.redirect(`/index/${userAcc}`);
			}
			);
			
		})
		
	});
	
	router.delete('/:account/avatars/:avatarId', (req, res) => {
		const userAcc = req.params.account
		const avatarId = req.params.avatarId
		db.User.findOne({account: userAcc},(err, foundUser)=>{
			if (err) {
				res.send(err);
			}
				db.Avatar.findByIdAndDelete(avatarId,(err, deletedAvatar)=>{
				if (err) {
					res.send(err);
				}
				db.User.findByIdAndUpdate(foundUser._id, { $pull:{ avatars: deletedAvatar._id}},{new:true},(err, updatedUser)=>{

					res.redirect(`/index/${userAcc}`);
				})
	})
		})
	
	
});

router.put('/:account/avatars/:avatarId/level', (req, res) => {
	const userAcc = req.params.account;
	const avatarId = req.params.avatarId;
	const rb = req.body;

	db.Avatar.findById(avatarId, (err, foundObj) => {
		
		const obj = {
			name: foundObj.name,
			info: foundObj.info,
			stats: {
				health: foundObj.stats.health,
				mana: foundObj.stats.mana,
				attack: foundObj.stats.attack,
				defence: foundObj.stats.defence,
				spclAttack: foundObj.stats.spclAttack,
				spclDefence: foundObj.stats.spclDefence,
				exp: +req.body.exp,
			},
			img: foundObj.img,
			user: foundObj.user
		}

		db.Avatar.findByIdAndUpdate(
				avatarId,
				obj,
				{ new: true },
				(err, updatedAvatar) => {
					if (err) {
						console.log('Error:');
						console.log(err);
						res.send(err);
					}
					return res.redirect(`/index/${userAcc}/avatars/${avatarId}/edit`);
				}
				);
				
		});
	});


function getRand(max, min) {
    let num = Math.random() * (max + 1 - min) + min - 1;
    num = Math.ceil(num);
    return num;
}

	//============================================================================================================================
	
	module.exports = router;