require('../config/database');
const express = require('express');
const router = express.Router();
const Model = require('../models/User');

router.get('/', (req, res) => {
	res.render('index.ejs');
});

router.post('/', (req, res) => {
	const objData = {
		property: arg,
	};

	Model.create(objData, (err, obj) => {
		if (err) {
			console.log('Error:');
			console.log(err);
		}
	});
});

router.put('/:id', (req, res) => {
	const updateObj = {
		property: newArg,
	};

	Model.findByIdAndUpdate(req.body.id, updateObj, { new: true }, (err, obj) => {
		if (err) {
			console.log('Error:');
			console.log(err);
		}
	});
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
