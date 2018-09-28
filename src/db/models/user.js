'use strict';
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define(
		'User',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					// exists: { msg: 'must be unique' },
					isLength: { msg: 'must be at least 6 characters' },
				},
			},

			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: { msg: 'must be a valid email' },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isLength: { msg: 'must be at least 6 characters in length' },
				},
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'standard',
			},
		},
		{},
	);
	User.associate = function(models) {
		// associations can be defined here
	};

	// We define an isAdmin method in the interface of the User model. The method will return true if the user has a role of admin. This allows us to write less code every time we need to check if a user is an admin.
	User.prototype.isAdmin = function() {
		return this.role === 'admin';
	};

	User.prototype.isMember = function() {
			return this.role === 'member';
		};

	User.prototype.isStandard = function() {
		return this.role === 'standard';
	};

	User.prototype.isPremium = function() {
		return this.role === 'premium';
	};

	return User;
};
