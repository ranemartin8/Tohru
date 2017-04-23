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
		redis.on('error', err => winston.error(`[REDIS]: Encountered error: ${err}`))
			.on('reconnecting', () => winston.warn('[REDIS]: Reconnecting...'));
	}
}

module.exports = Redis;
