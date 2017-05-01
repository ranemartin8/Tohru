const { Command } = require('discord.js-commando');

const Subscription = require('../../models/Subscription');

module.exports = class SubscribeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'subscribe',
			aliases: ['sub'],
			group: 'subscriptions',
			memberName: 'subscribe',
			description: 'Subscribe to the announcements of a specific topic.',

			args: [
				{
					key: 'topic',
					prompt: 'what topic would you like to subscribe to?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				}
			]
		});
	}

	async run(msg, { topic }) {
		if (!msg.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) {
			return msg.reply('I am missing `Manage Roles` permissions to assign roles.');
		}

		const subscription = await Subscription.findOne({
			where: {
				guild: msg.guild.id,
				topic
			}
		});
		if (!subscription) return msg.reply('no such subscription is available.');
		if (subscription.users.includes(msg.author.id)) return msg.reply('you are already subscribed to this topic.');

		const role = msg.guild.roles.get(subscription.role);
		await msg.member.addRole(role);

		await subscription.update({ users: subscription.users.concat([msg.author.id]) });

		return msg.reply(`successfully subscribed to ${topic}.`);
	}
};
