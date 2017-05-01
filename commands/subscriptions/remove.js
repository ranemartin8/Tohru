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
					prompt: 'what topic would you like to remove?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, { topic }) {
		if (!msg.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) {
			return msg.reply('I am missing `Manage Roles` permissions to delete roles.');
		}

		const subscription = await Subscription.findOne({
			where: {
				guild: msg.guild.id,
				topic
			}
		});
		if (!subscription) return msg.reply('that topic does not exist.');

		const role = msg.guild.roles.get(subscription.role);
		await role.delete();

		await subscription.destroy();

		return msg.reply(`successfully removed ${topic}.`);
	}
};
