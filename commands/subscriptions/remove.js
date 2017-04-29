const { Command } = require('discord.js-commando');

const Subscription = require('../../models/Subscription');

module.exports = class RemoveSubscriptionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove-sub',
			aliases: ['rem-sub', 'sub-remove', 'sub-rem'],
			group: 'subscriptions',
			memberName: 'remove',
			description: 'Remove a subscription topic for people to subscribe to.',

			args: [
				{
					key: 'topic',
					prompt: 'What topic would you like to remove?\n',
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
			return msg.reply('I am missing `Manage Roles` permissions to delete roles.');
		}

		const subscription = await Subscription.findByPrimary(topic);

		if (!subscription) return msg.reply('that topic does not exist.');

		const role = msg.guild.roles.get(subscription.role);
		await role.delete();

		await subscription.destroy();

		return msg.reply(`successfully removed ${topic}.`);
	}
};
