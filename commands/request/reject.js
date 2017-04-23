const { Command } = require('discord.js-commando');

const Request = require('../../models/Request');
const { requestsChannel: requestsChannelID } = require('../../config');

module.exports = class RejectRequestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reject',
			group: 'request',
			memberName: 'reject',
			description: 'Request a new feature for any of our projects!',
			guildOnly: true,

			args: [
				{
					key: 'requestID',
					prompt: 'What feature would you like to request?',
					type: 'integer'
				},
				{
					key: 'reason',
					prompt: 'Why did the request get rejected?',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { requestID, reason }) {
		if (msg.channel.id !== requestsChannelID) {
			return msg.reply('this command can only be used in the requests channel.');
		}

		const request = await Request.findById(requestID);
		if (!request) return msg.reply('you provided an invalid request id.');
		await request.update({
			processed: true,
			processedBy: msg.author.id,
			approved: false,
			reason
		});

		await this.client.users.get(request.requester).send({
			embed: {
				color: 0xED2136,
				author: {
					name: 'Request rejected',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: reason
			}
		});

		return msg.reply(`successfully rejected request #${request.id}!`).then(async () => {
			const messages = await msg.channel.fetchMessages({ after: request.requestMessage });
			const requestMessage = await msg.channel.fetchMessage(request.requestMessage);
			await new Promise(res => setTimeout(res, 1500));
			Promise.all([...messages.deleteAll(), requestMessage.delete()]);
		});
	}
};
