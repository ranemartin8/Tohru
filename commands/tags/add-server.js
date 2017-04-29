const { Command } = require('discord.js-commando');

const Tag = require('../../models/Tag');
const Util = require('../../util/Util');

module.exports = class ServerTagAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-server-tag',
			aliases: ['tag-add-server', 'add-servertag', 'servertag-add', 'servertag'],
			group: 'tags',
			memberName: 'add-server',
			description: 'Adds a server tag.',
			details: `Adds a server tag, usable for everyone on the server. (Markdown can be used.)`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					prompt: 'what would you like to name it?\n',
					type: 'string'
				},
				{
					key: 'content',
					prompt: 'what content would you like to add?\n',
					type: 'string',
					max: 1800
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.roles.exists('name', 'WeebDev');
	}

	async run(msg, { name, content }) {
		const tagName = Util.cleanContent(msg, name.toLowerCase());
		const tagContent = Util.cleanContent(msg, content);
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (tag) return msg.say(`A server tag with the name **${name}** already exists, ${msg.author}`);

		await Tag.create({
			userID: msg.author.id,
			userName: `${msg.author.username}#${msg.author.discriminator}`,
			guildID: msg.guild.id,
			guildName: msg.guild.name,
			channelID: msg.channel.id,
			channelName: msg.channel.name,
			name: tagName,
			content: tagContent,
			type: true
		});

		return msg.say(`A server tag with the name **${name}** has been added, ${msg.author}`);
	}
};
