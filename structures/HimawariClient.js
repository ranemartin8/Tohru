const { CommandoClient } = require('discord.js-commando');

const Database = require('./PostgreSQL');
const Redis = require('./Redis');

const database = new Database();
const redis = new Redis();

class HimawariClient extends CommandoClient {
	constructor(options) {
		super(options);
		this.database = database.db;
		this.redis = redis.db;

		database.start();
		redis.start();
	}
}

module.exports = HimawariClient;
