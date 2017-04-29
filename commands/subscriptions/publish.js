const { Command } = require('discord.js-commando');

const { ANNOUNCEMENT_CHANNEL } = process.env;
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
					prompt: 'What topic is the announcement for?\n',
					type: 'string'
				},
				{
					key: 'message',
					prompt: 'What message should the announcement have?\n',
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
		const message = args.message;

		const announcementsChannel = msg.guild.channels.get(ANNOUNCEMENT_CHANNEL);

		if (!announcementsChannel || announcementsChannel.type !== 'text') {
			return msg.reply('you have no set a valid announcements channel.');
		}

		if (!announcementsChannel.permissionsFor(msg.guild.member(this.client.user)).hasPermission('SEND_MESSAGES')) {
			return msg.reply(`I am missing \`Send Message\` permissions for ${announcementsChannel}`);
		}

		const subscription = await Subscription.findByPrimary(topic);
		const role = msg.guild.roles.find(subscription.role);
		await role.setMentionable(true);
		await announcementsChannel.send(`${role}, ${message}`);
		await role.setMentionable(false);

		return msg.reply('successfully published the announcement.');
	}
};
