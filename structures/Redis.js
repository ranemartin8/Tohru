const { promisifyAll } = require('tsubaki');
const redisClient = require('redis');
const winston = require('winston');

promisifyAll(redisClient.RedisClient.prototype);
promisifyAll(redisClient.Multi.prototype);

const redis = redisClient.createClient({ db: 4 });

class Redis {
	get db() {
		return redis;
	}

	start() {
		redis.on('error', err => winston.error(err))
			.on('reconnecting', () => winston.warn('Reconnecting...'));
	}
}

module.exports = Redis;
