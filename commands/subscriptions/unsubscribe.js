const { Command } = require('discord.js-commando');

const Subscription = require('../../models/Subscription');

module.exports = class UnsubscribeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unsubscribe',
			aliases: ['unsub'],
			group: 'subscriptions',
			memberName: 'unsubscribe',
			description: 'Unsubscribe to the announcements of a specific topic.',

			args: [
				{
					key: 'topic',
					prompt: 'What topic would you like to unsubscribe from?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { topic }) {
		if (!msg.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) {
			return msg.reply('I am missing `Manage Roles` permissions to assign roles.');
		}

		const subscription = await Subscription.findByPrimary(topic);

		if (!subscription) return msg.reply('no such subscription is available.');
		if (!subscription.users.includes(msg.author.id)) return msg.reply('you are not subscribed to this topic.');

		const role = msg.guild.roles.get(subscription.role);
		await msg.member.removeRole(role);

		const users = subscription.users;
		const index = users.indexOf(msg.author.id);
		users.splice(index, 1);
		await subscription.update({ users });

		return msg.reply(`successfully unsubscribed from ${topic}.`);
	}
};
