const { Command } = require('discord.js-commando');

const Issue = require('../../models/Issue');
const { issuesChannel } = require('../../config');

module.exports = class FixIssueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fix',
			group: 'issue',
			memberName: 'fix',
			description: 'Fix an issue.',
			guildOnly: true,

			args: [
				{
					key: 'issueID',
					prompt: 'which issue do you want to fix?\n',
					type: 'integer'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { issueID }) {
		if (msg.channel.id !== issuesChannel) {
			return msg.reply('this command can only be used in the issues channel.');
		}

		const issue = await Issue.findById(issueID);
		if (!issue) return msg.reply('you provided an invalid issue id.');
		await issue.update({
			processed: true,
			processedBy: msg.author.id,
			fixed: true
		});

		await this.client.users.get(issue.discoveredBy).send({
			embed: {
				color: 0x21ED36,
				author: {
					name: 'Issue fixed',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: 'Your issue has been reviewed and fixed!'
			}
		});

		return msg.reply(`successfully fixed issue #${issue.id}!`)
			.then(async () => {
				const messages = await msg.channel.fetchMessages({ after: issue.issueMessage });
				const issueMessage = await msg.channel.fetchMessage(issue.issueMessage);
				messages.deleteAll();
				issueMessage.delete();
			});
	}
};
