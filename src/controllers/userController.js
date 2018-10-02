const userQueries = require('../db/queries.users.js');
const wikiQueries = require('../db/queries.wikis.js');
const passport = require('passport');
const secretKey = process.env.stripeSecretTestKey;
const publicKey = 'pk_test_dTwq1s9L2aRKonJ1idkQTLtF';
var stripe = require('stripe')(secretKey);

module.exports = {
	authenticate(req, res, next) {
		if (!req.user) {
			req.flash('notice', 'Please sign in.');
			return res.redirect('/users/sign_in');
		} else {
			next();
		}
	},

	create(req, res, next) {
		//#1 We pull the values from the request's body and add them to a newUser object
		let newUser = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirmation: req.body.passwordConfirmation,
		};
		// #2 We call the createUser function, passing in newUser and a callback
		userQueries.createUser(newUser, (err, user) => {
			if (err) {
				req.flash('error', err);
				res.redirect('/users/sign_up');
			} else {
				// #3 If we created the user successfully, we authenticate the user by calling the  authenticate method on the Passport object. We specify the strategy to use (local) and pass a function to call for an authenticated user. This function sets a message and redirects to the landing page. authenticate uses the function in  passport-config.js where we defined the local strategy
				passport.authenticate('local')(req, res, () => {
					req.flash('notice', 'You\'ve successfully signed up! An email confirmation has been sent to you.');
					res.redirect('/');
				});
			}
		});
	},

	signIn(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}

			if (!user) {
				req.flash('notice', `Sign in failed. ${info.message}`);
				res.redirect('/users/sign_in');
			}

			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}

				req.flash('notice', 'You\'ve successfully signed in!');
				res.redirect('/');
			});
		})(req, res, next);
	},

	signInForm(req, res, next) {
		res.render('users/sign_in');
	},

	signUp(req, res, next) {
		res.render('users/sign_up');
	},

	signOut(req, res, next) {
		req.logout();
		req.flash('notice', 'You\'ve successfully signed out!');
		res.redirect('/');
	},

	show(req, res, next) {
		// Call the getUser method, pass it the ID of the user we are trying to visit
		userQueries.getUser(req.user.id, (err, result) => {
			// getUser will send back an object. If the user property of result is not defined that means no user with the passed ID was found.
			user = result['user'];
			if (err || result === undefined) {
				req.flash('notice', 'No user found with that ID.');
				res.redirect(404, '/');
			} else {
				// If the request was successfully handled, we render the view and pass in the unpacked object
				res.render('users/show', { result });
			}
		});
	},

	//change this to live secret key in production: https://dashboard.stripe.com/account/apikeys
	upgrade(req, res, next) {
		res.render('users/upgrade', { publicKey });
	},

	payment(req, res, next) {
		stripe.customers
			.create({
				email: req.body.stripeEmail,
				source: req.body.stripeToken,
			})
			.then(customer => {
				stripe.charges.create({
					amount: 1500,
					description: 'Koopipedia Premium Membership Fee',
					currency: 'USD',
					customer: customer.id,
				});
			})
			.then(charge => {
				userQueries.upgrade(req.user.dataValues.id);
				res.render('users/show');
			});
	},

	downgrade(req, res, next) {
		userQueries.downgrade(req.user.dataValues.id);
		wikiQueries.privateToPublic(req.user.dataValues.id);
		req.flash('notice', 'You are no longer a premium user and your private wikis are now public.');
		res.redirect('/');
	},
};
