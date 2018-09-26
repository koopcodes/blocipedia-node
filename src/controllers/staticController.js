module.exports = {
	index(req, res, next) {
		res.render('static/index', { title: 'Welcome to Koopipedia' });
	},

	marco(req, res, next) {
		res.render('static/partials/marco', { title: 'polo' });
	},

	about(req, res, next) {
		res.render('static/partials/about', { title: 'About Us' });
	},
};
