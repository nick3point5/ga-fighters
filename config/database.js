const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://nick3point5:Am8ltK7i3OvzWgtR@cluster0.c2x5q.mongodb.net/fighter?retryWrites=true&w=majority';
<<<<<<< HEAD
// const connectionString = 'mongodb://localhost:27017/projectOne'
=======
>>>>>>> e4c98260dba5c29837d96ba8f01f3664f2f76ae3
	
mongoose.connect(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});
mongoose.connection.on('connected', () => {
	console.log(`Mongoose connected`);
});
mongoose.connection.on('error', (err) => {
	console.log(`Mongoose connected error ` + err);
});
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

module.exports = {
	User: require('../models/User'),
	Avatar: require('../models/Avatar'),
};
