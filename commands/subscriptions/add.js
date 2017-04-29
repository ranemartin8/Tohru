const { Command } = require('discord.js-commando');

const Subscription = require('../../models/Subscription');

module.exports = class AddSubscriptionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-sub',
			aliases: ['sub-add'],
			group: 'subscriptions',
			memberName: 'add',
			description: 'Add a subscription topic for people to subscribe to.',

			args: [
				{
					key: 'topic',
					prompt: 'What topic would you like to add?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		const topic = args.topic.toLowercase();

		if (!msg.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) {
			return msg.reply('I am missing `Manage Roles` permissions to create roles.');
		}

		const subscription = await Subscription.findByPrimary(topic);

		if (subscription) return msg.reply('that topic is already available. Please choose a different name.');

		const role = await msg.guild.createRole({ name: topic });

		await Subscription.create({
			topic,
			role: role.id,
			mentionable: false
		});

		return msg.reply(`successfully added ${topic}.`);
	}
};
