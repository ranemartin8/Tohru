const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');

const Request = require('../../models/Request');
const { requestsChannel: requestsChannelID } = require('../../config');

module.exports = class RequestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'request',
			group: 'request',
			memberName: 'request',
			description: 'Request a new feature for any of our projects!',
			guildOnly: true,

			args: [
				{
					key: 'requestContent',
					prompt: 'What feature would you like to request?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { requestContent }) {
		const requestsChannel = this.client.channels.get(requestsChannelID);

		if (!requestsChannel || requestsChannel.type !== 'text') {
			return msg.reply(oneLine`
				the owner of this bot has not set a valid channel for requests,
				therefore this command is not available.
			`);
		}

		const nextID = await Request.count() + 1;

		const requestMessage = await requestsChannel.send({
			embed: {
				color: 0x30A9ED,
				author: {
					name: msg.author.tag,
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: requestContent,
				timestamp: new Date(),
				footer: { text: `Request #${nextID}` }
			}
		});

		await Request.create({
			requester: msg.author.id,
			request: requestContent,
			requestMessage: requestMessage.id
		});

		return msg.reply('your request has been acknowledged. Please wait until it has been reviewed.');
	}
};
