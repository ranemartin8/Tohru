const { Command } = require('discord.js-commando');

const Request = require('../../models/Request');
const { REQUEST_CHANNEL } = process.env;

module.exports = class ApproveRequestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'approve',
			group: 'request',
			memberName: 'approve',
			description: 'Approve a requested feature.',

			args: [
				{
					key: 'requestID',
					prompt: 'which feature request do you want to approve?\n',
					type: 'integer'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { requestID }) {
		if (msg.channel.id !== REQUEST_CHANNEL) return msg.reply('this command can only be used in the requests channel.');

		const request = await Request.findById(requestID);
		if (!request) return msg.reply('you provided an invalid request id.');
		await request.update({
			processed: true,
			processedBy: msg.author.id,
			approved: true
		});

		await this.client.users.get(request.requester).send({
			embed: {
				color: 0x21ED36,
				author: {
					name: 'Request approved',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: 'Your request has been reviewed and approved!',
				fields: [
					{
						name: 'Your request:',
						value: request.request.length <= 1024 ? request.request : `${request.request.substr(0, 1021)}...`
					}
				]
			}
		});

		return msg.reply(`successfully approved request #${request.id}!`)
			.then(async () => {
				const messages = await msg.channel.fetchMessages({ after: msg.id });
				const requestMessage = await msg.channel.fetchMessage(request.requestMessage);
				messages.deleteAll();
				msg.delete();
				requestMessage.delete();
			});
	}
};
