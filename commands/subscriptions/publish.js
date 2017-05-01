const { Command } = require('discord.js-commando');

const Subscription = require('../../models/Subscription');

module.exports = class PublishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'publish',
			group: 'subscriptions',
			memberName: 'publish',
			description: 'Publish an announcement.',

			args: [
				{
					key: 'topic',
					prompt: 'what topic is the announcement for?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				},
				{
					key: 'message',
					prompt: 'what message should the announcement have?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, { topic, message }) {
		const announcementsChannel = msg.guild.channels.get(msg.guild.settings.get('announcementsChannel'));
		if (!announcementsChannel || announcementsChannel.type !== 'text') {
			return msg.reply('you have no set a valid announcements channel.');
		}
		if (!announcementsChannel.permissionsFor(msg.guild.member(this.client.user)).has('SEND_MESSAGES')) {
			return msg.reply(`I am missing \`Send Message\` permissions for ${announcementsChannel}`);
		}

		const subscription = await Subscription.findOne({
			where: {
				guild: msg.guild.id,
				topic
			}
		});
		const role = msg.guild.roles.get(subscription.role);
		await role.setMentionable(true);
		await announcementsChannel.send(`${role}, ${message}`);
		await role.setMentionable(false);

		return msg.reply('successfully published the announcement.');
	}
};
