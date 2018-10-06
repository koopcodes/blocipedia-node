'use strict';
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define(
		'User',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
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
		User.hasMany(models.Wiki, {
			foreignKey: 'userId',
			as: 'wikis',
		});

		User.hasMany(models.Collaborator, {
			foreignKey: 'userId',
			as: 'collaborators',
		});
	};

	// We define an isAdmin method in the interface of the User model. The method will return true if the user has a role of admin. This allows us to write less code every time we need to check if a user is an admin.
	User.prototype.isAdmin = function() {
		return this.role === 'admin';
	};

	User.prototype.isStandard = function() {
		return this.role === 'standard';
	};

	User.prototype.isPremium = function() {
		return this.role === 'premium';
	};

	return User;
};
