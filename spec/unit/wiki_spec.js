const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('Wiki', () => {
	beforeEach(done => {
		this.wiki;
		this.user;
		sequelize.sync({ force: true }).then(res => {
			User.create({
				name: 'Gandalf',
				email: 'moria@youshallnotpass.com',
				password: 'AiNaVeduiMellon',
				role: 'standard',
			}).then(user => {
				this.user = user;
				Wiki.create({
					title: 'How to kill a Balrog',
					body: 'Hint: It helps if you are an Angel with a magic sword',
					userId: this.user.id,
					private: false,
				})
					.then(wiki => {
						this.wiki = wiki;
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});
	});

	// BEGIN Tests
	// BEGIN Create Test Context
	describe('#create()', () => {
		it('should create a public wiki with a title and body and associated user', done => {
			Wiki.create({
				title: 'The Creation of Arda',
				body: 'There was Eru, the One, who in Arda is called Ilúvatar',
				private: false,
				userId: this.user.id,
			})
				.then(wiki => {
					expect(wiki.title).toBe('The Creation of Arda');
					expect(wiki.body).toBe('There was Eru, the One, who in Arda is called Ilúvatar');
					expect(wiki.private).toBe(false);
					expect(wiki.userId).toBe(this.user.id);
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});

		it('should not create a wiki without a body', done => {
			Wiki.create({
				title: 'The Creation of Arda',
				private: false,
				userId: this.user.id,
			})
				.then(wiki => {
					done();
				})
				.catch(err => {
					expect(err.message).toContain('Wiki.body cannot be null');
					done();
				});
		});

		it('should not create a wiki without a user', done => {
			Wiki.create({
				title: 'The Creation of Arda',
				body: 'But Melkor was ashamed',
				private: false,
			})
				.then(wiki => {
					done();
				})
				.catch(err => {
					expect(err.message).toContain('Wiki.userId cannot be null');
					done();
				});
		});

		it('should not create a wiki without a title', done => {
			Wiki.create({
				body: 'But Melkor was ashamed',
				private: false,
				userId: this.user.id,
			})
				.then(wiki => {
					done();
				})
				.catch(err => {
					expect(err.message).toContain('Wiki.title cannot be null');
					done();
				});
		});

		it('should not create a wiki with a title already taken', done => {
			Wiki.create({
				title: 'Frodo Lives!',
				body: 'So do Sam and Gimli.',
				private: false,
				userId: this.user.id
			})
				.then(wiki => {
					Wiki.create({
						title: 'Frodo Lives!',
						body: 'So do Sam and Gimli.',
						private: false,
						userId: this.user.id
					})
						.then(wiki => {
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

	// END Create Test Context

	// BEGIN Delete Test Context

	describe('#destroy()', () => {
		it('should delete the specified wiki', done => {
			Wiki.destroy({ where: { id: this.wiki.id } })
				.then(wiki => {
					expect(wiki.title).toBe(undefined);
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});
	});

	// END Delete Test Context

	// END Tests
});
