const { CommandoClient } = require('discord.js-commando');

const Database = require('./PostgreSQL');
const Redis = require('./Redis');

const redis = new Redis();

class HimawariClient extends CommandoClient {
	constructor(options) {
		super(options);
		this.database = Database.db;
		this.redis = redis.db;

		Database.start();
		redis.start();
	}
}

module.exports = HimawariClient;
