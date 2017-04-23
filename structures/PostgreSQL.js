const Sequelize = require('sequelize');
const winston = require('winston');

const { db } = require('../config');

const database = new Sequelize(db, { logging: false });

class Database {
	static get db() {
		return database;
	}

	static start() {
		database.authenticate()
			.then(() => winston.info('[POSTGRES]: Connection to database has been established successfully.'))
			.then(() => winston.info('[POSTGRES]: Synchronizing database...'))
			.then(() => database.sync()
				.then(() => winston.info('[POSTGRES]: Synchronizing database done!'))
				.catch(error => winston.error(`[POSTGRES]: Error synchronizing the database: ${error}`))
			)
			.then(() => winston.info('[POSTGRES]: Ready to rock!'))
			.catch(error => winston.error(`[POSTGRES]: Unable to connect to the database: ${error}`));
	}
}

module.exports = Database;
