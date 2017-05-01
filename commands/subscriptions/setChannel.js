const { Command } = require('discord.js-commando');

module.exports = class SetChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'announcements-channel',
			group: 'subscriptions',
			memberName: 'channel',
			description: 'Sets the channel the announcements should be sent to.',

			args: [
				{
					key: 'channel',
					prompt: 'What channel would you like the announcements to be sent to?\n',
					type: 'channel'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, { channel }) { // eslint-disable-line require-await
		msg.guild.settings.set('announcementsChannel', channel.id);
		return msg.reply(`announcements channel set to ${channel}`);
	}
};
