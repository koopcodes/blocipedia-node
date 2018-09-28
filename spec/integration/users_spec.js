const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/users/';
const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe('routes : users', () => {
		beforeEach(done => {
			sequelize
				.sync({ force: true })
				.then(() => {
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});

		describe('#create()', () => {
			it('should create a User object with a valid email and password', done => {
				User.create({
					name: 'PrimeUser',
					email: 'user@example.com',
					password: '1234567890',
				})
					.then(user => {
						expect(user.name).toBe('PrimeUser');
						expect(user.email).toBe('user@example.com');
						expect(user.id).toBe(1);
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});

			it('should not create a user with invalid username', done => {
				User.create({
					name: 'koop',
					email: 'user@example.com',
					password: 'OogaBoogaSigmaChi',
				})
					.then(user => {
						// The code in this block will not be evaluated since the validation error
						// will skip it. Instead, we'll catch the error in the catch block below
						// and set the expectations there.

						done();
					})
					.catch(err => {
						expect(err.message).toContain('Validation error: must be a valid username');
						done();
					});
			});

			it('should not create a user with invalid email', done => {
				User.create({
					name: 'PrimeUser',
					email: "D'oh!",
					password: '1234567890',
				})
					.then(user => {
						// The code in this block will not be evaluated since the validation error
						// will skip it. Instead, we'll catch the error in the catch block below
						// and set the expectations there.

						done();
					})
					.catch(err => {
						expect(err.message).toContain('Validation error: must be a valid email');
						done();
					});
			});

			it('should not create a user with invalid password', done => {
				User.create({
					name: 'PrimeUser',
					email: 'user@example.com',
					password: 'Ooga Booga Sigma Chi',
				})
					.then(user => {
						// The code in this block will not be evaluated since the validation error
						// will skip it. Instead, we'll catch the error in the catch block below
						// and set the expectations there.

						done();
					})
					.catch(err => {
						expect(err.message).toContain('Validation error: must be a valid password');
						done();
					});
			});


			it('should not create a user with a username already taken', done => {
				User.create({
					name: 'PrimeUser',
					email: 'user@example.com',
					password: '1234567890',
				})
					.then(user => {
						User.create({
							name: 'PrimeUser',
							email: 'primeuser@example.com',
							password: 'nanananananananananananananananaBATMAN!',
						})
							.then(user => {
								// the code in this block will not be evaluated since the validation error
								// will skip it. Instead, we'll catch the error in the catch block below
								// and set the expectations there

								done();
							})
							.catch(err => {
								expect(err.message).toContain('Validation error');
								done();
							});

						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});

			it('should not create a user with an email already taken', done => {
				User.create({
					name: 'PrimeUser',
					email: 'user@example.com',
					password: '1234567890',
				})
					.then(user => {
						User.create({
							name: 'UserPrime',
							email: 'user@example.com',
							password: 'FrodoLives',
						})
							.then(user => {
								// the code in this block will not be evaluated since the validation error
								// will skip it. Instead, we'll catch the error in the catch block below
								// and set the expectations there

								done();
							})
							.catch(err => {
								expect(err.message).toContain('Validation error');
								done();
							});

						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});

		describe('GET /users/sign_in', () => {
			it('should render a view with a sign in form', done => {
				request.get(`${base}sign_in`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Sign in');
					done();
				});
			});
		});

		describe('GET /users/sign_up', () => {
			it('should render a view with a sign up form', done => {
				request.get(`${base}sign_up`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Sign up');
					done();
				});
			});
		});

		// // BEGIN User Scope Test Context

		// // Define a suite for /users/:id
		// describe('GET /users/:id', () => {
		// 	beforeEach(done => {
		// 		// Define the variables
		// 		this.user;
		// 		this.post;
		// 		this.comment;

		// 		User.create({
		// 			name: 'Starman',
		// 			email: 'starman@tesla.com',
		// 			password: 'Trekkie4lyfe',
		// 		}).then(res => {
		// 			this.user = res;

		// 			Topic.create(
		// 				{
		// 					title: 'Winter Games',
		// 					description: 'Post your Winter Games stories.',
		// 					posts: [
		// 						{
		// 							title: 'Snowball Fighting',
		// 							body: 'So much snow!',
		// 							userId: this.user.id,
		// 						},
		// 					],
		// 				},
		// 				{
		// 					include: {
		// 						model: Post,
		// 						as: 'posts',
		// 					},
		// 				},
		// 			).then(res => {
		// 				this.post = res.posts[0];

		// 				Comment.create({
		// 					body: 'This comment is alright.',
		// 					postId: this.post.id,
		// 					userId: this.user.id,
		// 				}).then(res => {
		// 					this.comment = res;
		// 					done();
		// 				});
		// 			});
		// 		});
		// 	});

		// 	// Write a spec that makes the request to the profile page
		// 	it('should present a list of comments and posts a user has created', done => {
		// 		request.get(`${base}${this.user.id}`, (err, res, body) => {
		// 			// The spec sets the expectations that there will be a list with the comment and post we just created
		// 			expect(body).toContain('Snowball Fighting');
		// 			expect(body).toContain('This comment is alright.');
		// 			done();
		// 		});
		// 	});
		// });

		// // END User Scope Test Context
	});
