const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe('User', () => {
	beforeEach(done => {
		// #1 We start each test with an empty table
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
		// #2 We write a test to ensure the successful creation of a user with the right attribute values
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

		// #3 We attempt, and fail, to create a user with a wrongly formatted email
		it('should not create a user with invalid username, email or password', done => {
			User.create({
				name: 'PrimeUser',
				email: 'don\'t panic',
				password: '1234567890',
			})
				.then(user => {
					// The code in this block will not be evaluated since the validation error will skip it. Instead, we'll catch the error in the catch block below and set the expectations there.

					done();
				})
				.catch(err => {
					// #4 We confirm that we return a validation error
					expect(err.message).toContain('Validation error: must be a valid email');
					done();
				});
		});

		it('should not create a user with an email already taken', done => {
			// #5 We test that a validation error returns when we attempt to create a user with a duplicate email
			User.create({
				name: 'PrimeUser',
				email: 'user@example.com',
				password: '1234567890',
			})
				.then(user => {
					User.create({
						name: 'UserPrime',
						email: 'user@example.com',
						password: 'OogaBoogaSigmaChi',
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

		it('should not create a user with Username already taken', done => {
			// #5 We test that a validation error returns when we attempt to create a user with a duplicate name
			User.create({
				name: 'PrimeUser',
				email: 'user@example.com',
				password: '1234567890',
			})
				.then(user => {
					User.create({
						name: 'PrimeUser',
						email: 'primeuser@example.com',
						password: 'OogaBooga',
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
});
