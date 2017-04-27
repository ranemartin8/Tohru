const { FriendlyError } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const path = require('path');
const winston = require('winston');

const { commandPrefix, owner, token } = require('./config');
const HimawariClient = require('./structures/HimawariClient');
const SequelizeProvider = require('./providers/Sequelize');

const client = new HimawariClient({
	owner: owner,
	commandPrefix,
	unknownCommandResponse: false,
	disableEveryone: true
});

client.setProvider(new SequelizeProvider(client.database));

client.on('error', winston.error)
	.on('warn', winston.warn)
	.on('ready', () =>
		winston.info(oneLine`
			[DISCORD]: Client ready...
			Logged in as ${client.user.tag}
			(${client.user.id})
		`)
	)
	.on('disconnect', () => winston.warn('[DISCORD]: Disconnected!'))
	.on('reconnect', () => winston.warn('[DISCORD]: Reconnecting...'))
	.on('commandRun', (cmd, promise, msg, args) =>
		winston.info(oneLine`
			[DISCORD]: ${msg.author.tag} (${msg.author.id})
			> ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
			>> ${cmd.groupID}:${cmd.memberName}
			${Object.values(args)[0] !== '' || !Object.values(args).length ? `>>> ${Object.values(args)}` : ''}
		`)
	)
	.on('unknownCommand', msg => {
		if (msg.channel.type === 'dm') return;
		if (msg.author.bot) return;

		const args = { name: msg.content.split(client.commandPrefix)[1] };
		client.registry.resolveCommand('tags:tag').run(msg, args);
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof FriendlyError) return;
		winston.error(`[DISCORD]: Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) =>
		winston.info(oneLine`
			[DISCORD]: Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.tag} (${msg.author.id}): ${reason}
		`)
	)
	.on('commandPrefixChange', (guild, prefix) =>
		winston.info(oneLine`
			[DISCORD]: Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
	)
	.on('commandStatusChange', (guild, command, enabled) =>
		winston.info(oneLine`
			[DISCORD]: Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
	)
	.on('groupStatusChange', (guild, group, enabled) =>
		winston.info(oneLine`
			[DISCORD]: Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
	);

client.registry
	.registerDefaults()
	.registerGroups([
		['request', 'Requests'],
		['issue', 'Issues'],
		['tags', 'Tags']
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);

process.on('unhandledRejection', err => winston.error(`Uncaught Promise Error: \n${err.stack}`));
