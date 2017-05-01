const { Command } = require('discord.js-commando');

const Subscription = require('../../models/Subscription');

module.exports = class ListSubscriptionsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list-subscriptions',
			aliases: [
				'list-subs',
				'ls-subs',
				'ls-subscriptions',
				'subscriptions-list',
				'subscription-list',
				'sub-list',
				'subs-list',
				'sub-ls',
				'subs-ls'
			],
			group: 'subscriptions',
			memberName: 'list',
			description: 'List all possible subscriptions.'
		});
	}

	async run(msg) {
		const subscriptions = await Subscription.findAll({
			where: { guild: msg.guild.id },
			attributes: ['topic']
		});

		if (!subscriptions.length) return msg.reply('there are no subscriptions available at this time.');
		return msg.reply(`the following subscriptions are available:\n${subscriptions.map(sub => sub.name)}`);
	}
};
