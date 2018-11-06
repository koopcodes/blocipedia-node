require('dotenv').config();
// Require the User model and the bcrypt library
const User = require('./models').User;
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const Collaborator = require('./models').Collaborator;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
	// createUser takes an object with email, password, and passwordConfirmation properties, and a callback
	createUser(newUser, callback) {
		// Use bcrypt to generate a salt (data to pass to hashing function) and pass that to the hashSync hashing function with the password to hash
		const salt = bcrypt.genSaltSync();
		const hashedPassword = bcrypt.hashSync(newUser.password, salt);

		// #4 Store the hashed password in the database when we create the User object and return the user
		return User.create({
			name: newUser.name,
			email: newUser.email,
			password: hashedPassword,
		})
			.then((user) => {
				const msg = {
					to: newUser.email,
					from: 'donotreply@koopipedia.com',
					subject: 'Welcome to Koopipedia',
					text:
						'Welcome! Thank you for joining Koopipedia. To start contributing to the Wiki community please visit the site and login with the user information you provided. Looking forward to collaborating with you! - Koop from the Koopipedia Team',
					html:
						'Welcome! Thank you for joining Koopipedia. To start contributing to the Wiki community please visit the site and login with the user information you provided. Looking forward to collaborating with you! <br><br>- Koop from the Koopipedia Team',
				};

				sgMail.send(msg);

				callback(null, user);
			})
			.catch((err) => {
				console.log('createUser query error: ' + err);
				callback(err);
			});
	},

	getUser(id, callback) {
		// Define a result object to hold the user and their collaborations that we will return and request the User object from the database
		let result = {};
		User.findById(id).then((user) => {
			if (!user) {
				callback(404);
			} else {
				result['user'] = user;
				Collaborator.scope({ method: ['collaborationsFor', id] })
					.all()
					.then((collaborations) => {
						result['collaborations'] = collaborations;
						callback(null, result);
					})
					.catch((err) => {
						callback(err);
					});
			}
		});
	},

	upgrade(id, callback) {
		return User.findById(id)
			.then((user) => {
				if (!user) {
					return callback('User does not exist!');
				} else {
					return user.updateAttributes({ role: 'premium' });
				}
			})
			.catch((err) => {
				callback(err);
			});
	},

	downgrade(id, callback) {
		return User.findById(id)
			.then((user) => {
				if (!user) {
					return callback('User does not exist!');
				} else {
					return user.updateAttributes({ role: 'standard' });
				}
			})
			.catch((err) => {
				callback(err);
			});
	},
};
