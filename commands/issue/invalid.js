const { Command } = require('discord.js-commando');

const Issue = require('../../models/Issue');
const { issuesChannel } = require('../../config');

module.exports = class InvalidIssueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invalid',
			group: 'issue',
			memberName: 'invalid',
			description: 'Mark an issue as invalid.',

			args: [
				{
					key: 'issueID',
					prompt: 'which issue would you like to invalidate?\n',
					type: 'integer'
				},
				{
					key: 'reason',
					prompt: 'why do you want to mark the issue as invalid?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { issueID, reason }) {
		if (msg.channel.id !== issuesChannel) {
			return msg.reply('this command can only be used in the issues channel.');
		}

		const issue = await Issue.findById(issueID);
		if (!issue) return msg.reply('you provided an invalid issue id.');
		await issue.save({
			processed: true,
			processedBy: msg.author.id,
			fixed: false,
			reason
		});

		await this.client.users.get(issue.discoveredBy).send({
			embed: {
				color: 0xED2136,
				author: {
					name: 'Issue invalidated',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: reason,
				fields: [
					{
						name: 'Your issue:',
						value: issue.issue.length <= 1024 ? issue.issue : `${issue.issue.substr(0, 1021)}...`
					}
				]
			}
		});

		return msg.reply(`successfully rejected issue #${issue.id}!`)
			.then(async () => {
				const messages = await msg.channel.fetchMessages({ after: issue.issueMessage });
				const issueMessage = await msg.channel.fetchMessage(issue.issueMessage);
				messages.deleteAll();
				issueMessage.delete();
			});
	}
};
