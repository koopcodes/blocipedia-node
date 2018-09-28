require('dotenv').config();
// Require the User model and the bcrypt library
const User = require('./models').User;
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
// const Collaborator = require("./models").Collaborator;

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
			.then(user => {
				const msg = {
					to: newUser.email,
					from: 'donotreply@koopipedia.com',
					subject: 'Welcome to Koopipedia',
					text:
						'Thank you for joining Koopipedia. To start contributing to the Wiki community please visit the site and login with the user information you provided. Looking forward to collaborating with you! - Koop from the Koopipedia Team',
					html:
						'Thank you for joining Koopipedia. To start contributing to the Wiki community please visit the site and login with the user information you provided. Looking forward to collaborating with you! <br><br>- Koop from the Koopipedia Team',
				};

				sgMail.send(msg);

				callback(null, user);
			})
			.catch(err => {
				callback(err);
			});
	},

	getUser(id, callback) {
		// Define a result object to hold the user that we will return and request the User object from the database
		let result = {};
		User.findById(id).then(user => {
			// If no user returns return an error
			if (!user) {
				callback(404);
			} else {
				// Otherwise, store the resulting user
				result['user'] = user;
			}
		});
	},
	// END Get User
};
