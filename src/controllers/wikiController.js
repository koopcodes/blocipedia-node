const wikiQueries = require('../db/queries.wikis.js');
const Authorizer = require('../policies/wiki');
const markdown = require('markdown').markdown;

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
					res.redirect(500, '/wikis/new');
				} else {
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
			if (err) {
				res.redirect(500, `/wikis/${wiki.id}`);
			} else {
				if (privacyFlag) {
					res.redirect(303, '/wikis/private');
				} else {
					res.redirect(303, '/wikis');
				}
			}
		});
	},

	edit(req, res, next) {
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				const authorized = new Authorizer(req.user, wiki).edit();
				if (authorized) {
					res.render('wikis/edit', { wiki });
				} else {
					req.flash('notice', 'You are not authorized to do that.');
					res.redirect(`/wikis/${wiki.id}`);
				}
			}
		});
	},

	index(req, res, next) {
		wikiQueries.getAllWikis((err, wikis) => {
			if (err) {
				res.redirect(500, 'static/index');
			} else {

				res.render('wikis/wiki', { wikis });
			}
		});
	},

	new(req, res, next) {
		const authorized = new Authorizer(req.user).new();
		if (authorized) {
			res.render('wikis/new');
		} else {
			req.flash('notice', 'You are not authorized to do that.');
			res.redirect('/wikis');
		}
	},

	privateIndex(req, res, next) {
		wikiQueries.getAllWikis((err, wikis) => {
			if (err) {
				res.redirect(500, 'static/index');
			} else {
				res.render('wikis/private', { wikis });
			}
		});
	},

	show(req, res, next) {
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				wiki.body = markdown.toHTML(wiki.body);
				res.render('wikis/show', { wiki });
			}
		});
	},

	update(req, res, next) {
		wikiQueries.updateWiki(req, req.body, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, `/wikis/$${wiki.id}/edit`);
			} else {
				res.redirect(`/wikis/${wiki.id}`);
			}
		});
	},
};
