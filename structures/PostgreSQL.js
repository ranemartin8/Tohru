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
				.then(() => winston.info('[POSTGRES]: Done Synchronizing database!'))
				.catch(error => winston.error(`[POSTGRES]: Error synchronizing the database: \n${error}`))
			)
			.catch(error => winston.error(`[POSTGRES]: Unable to connect to the database: \n${error}`));
	}
}

module.exports = Database;
