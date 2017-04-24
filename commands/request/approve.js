const { Command } = require('discord.js-commando');

const Request = require('../../models/Request');
const { requestsChannel } = require('../../config');

module.exports = class ApproveRequestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'approve',
			group: 'request',
			memberName: 'approve',
			description: 'Approve a requested feature.',
			guildOnly: true,

			args: [
				{
					key: 'requestID',
					prompt: 'which feature request do you wanna approve?\n',
					type: 'integer'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { requestID }) {
		if (msg.channel.id !== requestsChannel) {
			return msg.reply('this command can only be used in the requests channel.');
		}

		const request = await Request.findById(requestID);
		if (!request) return msg.reply('you provided an invalid request id.');
		await request.update({
			processed: true,
			processedBy: msg.author.id,
			approved: true
		});

		await this.client.users.get(request.requester).send({
			embed: {
				color: 0xED2136,
				author: {
					name: 'Request approved',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: 'Your request has been reviewed and approved!'
			}
		});

		return msg.reply(`successfully approved request #${request.id}!`)
			.then(async () => {
				const messages = await msg.channel.fetchMessages({ after: request.requestMessage });
				const requestMessage = await msg.channel.fetchMessage(request.requestMessage);
				messages.deleteAll();
				requestMessage.delete();
			});
	}
};
