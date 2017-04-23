const { CommandoClient } = require('discord.js-commando');

const Database = require('./PostgreSQL');
const Redis = require('./Redis');

class HimawariClient extends CommandoClient {
	constructor(options) {
		super(options);
		this.database = Database.db;
		this.redis = Redis.db;

		Database.start();
		Redis.start();
	}
}

module.exports = HimawariClient;
