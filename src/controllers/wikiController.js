const wikiQueries = require('../db/queries.wikis.js');
const Authorizer = require('../policies/wiki');

module.exports = {
	create(req, res, next) {
		const authorized = new Authorizer(req.user).create();

		if (authorized) {
			let newWiki = {
				title: req.body.title,
				body: req.body.body,
				private: req.body.private,
				userId: req.user.id,
			};
			wikiQueries.addWiki(newWiki, (err, wiki) => {
				if (err) {
					console.log('wikiController addWiki error: ' + err);
					res.redirect(500, '/wikis/new');
				} else {
					console.log('wikiController addWiki called!');
					res.redirect(303, `/wikis/${wiki.id}`);
				}
			});
		} else {
			req.flash('notice', 'You are not authorized to do that.');
			res.redirect('/wikis');
		}
	},

	destroy(req, res, next) {
		wikiQueries.deleteWiki(req, (err, wiki) => {
		const privacyFlag = wiki.private;
		console.log('privacyFlag: '+ privacyFlag);
			if (err) {
				console.log('wikiController destroy error: ', err);
				res.redirect(500, `/wikis/${wiki.id}`);
			} else {
				if (privacyFlag) {
				res.redirect(303, '/wikis/private');
				} else {
				res.redirect(303, '/wikis');}
			}
		});
	},

	edit(req, res, next) {
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				console.log('wikiController edit error or wiki null: ' + err + wiki);
				res.redirect(404, '/');
			} else {
				const authorized = new Authorizer(req.user, wiki).edit();
				if (authorized) {
					console.log('wikiController edit CALLED! :)');
					res.render('wikis/edit', { wiki });
				} else {
					console.log('wikiController edit authorized FAILED! :)');
					req.flash('notice', 'You are not authorized to do that.');
					res.redirect(`/wikis/${wiki.id}`);
				}
			}
		});
	},

	index(req, res, next) {
		wikiQueries.getAllWikis((err, wikis) => {
			if (err) {
				console.log('wikiController index error: ' + err);
				res.redirect(500, 'static/index');
			} else {
				console.log('wikiController index ELSE CALLED! :)');
				res.render('wikis/wiki', { wikis });
			}
		});
	},

	new(req, res, next) {
		const authorized = new Authorizer(req.user).new();
		if (authorized) {
			console.log('wikiController new CALLED! :)');
			res.render('wikis/new');
		} else {
			console.log('wikiController new authorized FAILED! :)');
			req.flash('notice', 'You are not authorized to do that.');
			res.redirect('/wikis');
		}
	},

	privateIndex(req, res, next) {
		wikiQueries.getAllWikis((err, wikis) => {
			if (err) {
				console.log('wikiController privateIndex error: ' + err);
				res.redirect(500, 'static/index');
			} else {
								console.log('wikiController privateIndex CALLED! :)');
				res.render('wikis/private', { wikis });
			}
		});
	},

	show(req, res, next) {
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				console.log('wikiController show error or wiki null: ' + err + wiki);
				res.redirect(404, '/');
			} else {
				console.log('wikiController show CALLED! :)');
				res.render('wikis/show', { wiki });
			}
		});
	},

	update(req, res, next) {
		wikiQueries.updateWiki(req, req.body, (err, wiki) => {
			if (err || wiki == null) {
				console.log('wikiController update error or wiki null: ' + err + wiki);
				res.redirect(404, `/wikis/$${wiki.id}/edit`);
			} else {
				console.log('wikiController update CALLED! :)');
				res.redirect(`/wikis/${wiki.id}`);
			}
		});
	},
};
