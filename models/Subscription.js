const Sequelize = require('sequelize');

const Database = require('../structures/PostgreSQL');

const Subscription = Database.db.define('subscriptions', {
	guild: {
		type: Sequelize.STRING,
		allowNull: false
	},
	topic: {
		type: Sequelize.STRING,
		allowNull: false
	},
	users: {
		type: Sequelize.ARRAY(Sequelize.STRING), // eslint-disable-line new-cap
		allowNull: false,
		defaultValue: []
	},
	role: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Subscription;
