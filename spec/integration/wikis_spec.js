const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/wikis/';
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : wikis', () => {
	// BEGIN All Tests

	// BEGIN Premium and Admin CRUD Test Context
	describe('Premium and Admin performing CRUD on wikis', () => {
		beforeEach(done => {
			// Initialize variables and DB before each test
			this.user;
			this.wiki;

			sequelize
				.sync({ force: true })
				.then(res => {
					User.create({
						// Create Premium User
						name: 'Elessar',
						email: 'highKing@reunitedKingdom.com',
						password: 'Telcontar',
						role: 'premium',
					}).then(user => {
						this.user = user;
						request.get({
							url: 'http://localhost:3000/auth/fake',
							form: {
								name: user.name,
								role: user.role,
								userId: user.id,
								email: user.email,
							},
						});

						Wiki.create({
							//Create Public Wiki
							title: 'Adventures of Thorongil',
							body: 'All those who resist Sauron may read from this public wiki',
							userId: user.id,
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
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});

		// Premium User sees all private Wikis
		describe('GET /wikis/private', () => {
			it('should render the private wiki page', done => {
				request.get(`${base}private`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Private Wikis');
					done();
				});
			});
		});

		// Premium User creates private Wikis
		describe('GET /wikis/create', () => {
			it('should create a new private wiki', done => {
				const options = {
					url: `${base}create`,
					form: {
						title: 'The Lay of Lúthien',
						body: 'The Lady Fair with Honey in her Hair',
						userId: this.user.id,
						private: true,
					},
				};

				request.post(options, (err, res, body) => {
					Wiki.findOne({ where: { title: 'The Lay of Lúthien' } })
						.then(wiki => {
							expect(wiki).not.toBeNull();
							expect(wiki.title).toBe('The Lay of Lúthien');
							expect(wiki.body).toBe('The Lady Fair with Honey in her Hair');
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				});
			});
		});

		// Delete Wiki
		describe('POST /wikis/:id/destroy', () => {
			it('should delete the wiki with associated id', done => {
				Wiki.all().then(wikis => {
					const wikiCountBeforeDelete = wikis.length;

					expect(wikiCountBeforeDelete).toBe(1);

					request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
						Wiki.all()
							.then(wikis => {
								expect(err).toBeNull();
								expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});
			});
		});
	}); // END Premium and Admin Test Context

	// BEGIN Standard Test Context
	describe('Standard User performing CRUD on wikis', () => {
		beforeEach(done => {
			this.wiki;
			this.user;

			sequelize.sync({ force: true }).then(res => {
				User.create({
					name: 'Gimli',
					email: 'theForge@LonelyMountain.com',
					password: 'TelcharOfNogrod',
					role: 'standard',
				})
					.then(user => {
						this.user = user;

						request.get({
							url: 'http://localhost:3000/auth/fake',
							form: {
								name: user.name,
								role: user.role,
								userId: user.id,
								email: user.email,
							},
						});
					})
					.then(() => {
						Wiki.create({
							title: 'Children of AüLE',
							body: 'Before even the Elves were the Dwarves',
						}).then(wiki => {
							this.wiki = wiki;
							done();
						});
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});

		describe('GET /wikis/new', () => {
			it('should render a new post form', done => {
				request.get(`${base}new`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('New Wiki');
					done();
				});
			});
		});

		describe('POST /wikis/create', () => {
			it('should create a new wiki and redirect', done => {
				const options = {
					url: `${base}create`,
					form: {
						title: 'The Secret Dwarven Language',
						body: 'Only a handful of words are known to Outsiders',
						userId: this.user.id,
						private: false,
					},
				};

				request.post(options, (err, res, body) => {
					Wiki.findOne({ where: { title: 'The Secret Dwarven Language' } })
						.then(wiki => {
							expect(wiki).not.toBeNull();
							expect(wiki.title).toBe('The Secret Dwarven Language');
							expect(wiki.body).toBe('Only a handful of words are known to Outsiders');
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				});
			});
		});

		describe('GET /wikis/:id', () => {
			it('should render a view with the selected wiki', done => {
				request.get(`${base}${this.wiki.id}`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Before even the Elves were the Dwarves');
					done();
				});
			});
		});

		describe('POST /wikis/:id/destroy', () => {
			it('should delete the wiki with associated id', done => {
				Wiki.all().then(wikis => {
					const wikiCountBeforeDelete = wikis.length;

					expect(wikiCountBeforeDelete).toBe(1);

					request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
						Wiki.all()
							.then(wikis => {
								expect(err).toBeNull();
								expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});
			});
		});

		describe('GET /wikis/:id/edit', () => {
			it('should render a view with an edit wiki form', done => {
				request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Edit Wiki');
					expect(body).toContain('Before even the Elves were the Dwarves');
					done();
				});
			});
		});

		describe('POST /wikis/:id/update', () => {
			it('should update the wiki with the given values', done => {
				request.post(
					{
						url: `${base}${this.wiki.id}/update`,
						form: {
							title: 'Update this Wiki',
							body: 'Has this been updated yet?',
							userId: this.user.id,
						},
					},
					(err, res, body) => {
						expect(err).toBeNull();
						Wiki.findOne({
							where: { id: 1 },
						})
							.then(wiki => {
								expect(wiki.title).toBe('Update this Wiki');
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					},
				);
			});
		});
	}); // END Standard Test Context

	// BEGIN Guest Test Context
	describe('guest attempting to perform CRUD actions for Wikis', () => {
		beforeEach(done => {

			// this.wiki;
			// this.user;

			// sequelize.sync({ force: true }).then(res => {
			// 	Wiki.create({
			// 				title: 'Children of AüLE',
			// 				body: 'Before even the Elves were the Dwarves',
			// 				private: false,
			// 				userId: 1,
			// 			}).then(wiki => {
			// 				this.wiki = wiki;
			// 				done();
			// 			});
			// 		})
			// 		.catch(err => {
			// 			console.log(err);
			// 			done();
			// 		});

			request.get(
				{
					url: 'http://localhost:3000/auth/fake', 					// mock authentication
					form: {
						userId: 0,				// flag to indicate mock auth to destroy any session

					},
				},
				(err, res, body) => {
					done();
				},
			);
		});


		describe('POST /wikis/create', () => {
			it('should not create a new Wiki', done => {
				const options = {
					url: `${base}${this.wiki.id}/create`,
					form: {
						body: 'Guests cannot create wikis',
					},
				};
				request.post(options, (err, res, body) => {
					Wiki.findOne({ where: { body: 'Guests cannot create wikis' } })
						.then(wiki => {
							expect(wiki).toBeNull(); // ensure no wiki was created
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				});
			});
		});

		describe('POST /wikis/:id/destroy', () => {
			it('should not delete the wiki with the associated ID', done => {

				Wiki.all().then(wikis => {
					const wikiCountBeforeDelete = wikis.length;
					expect(wikiCountBeforeDelete).toBe(1);
					request.post(
						`${base}${this.wiki.id}/destroy`,
						(err, res, body) => {
							Wiki.all().then(wikis => {
								expect(err).toBeNull();
								expect(wikis.length+1).toBe(wikiCountBeforeDelete);
								done();
							});
						},
					);
				});
			});
		});
	}); // END Guest Test Context

}); // END All Tests
