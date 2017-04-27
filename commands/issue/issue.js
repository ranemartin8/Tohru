const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');

const Issue = require('../../models/Issue');
const { issuesChannel: issuesChannelID } = require('../../config');

module.exports = class IssueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'issue',
			group: 'issue',
			memberName: 'issue',
			description: 'Create a new issue for any of our projects!',

			args: [
				{
					key: 'issueContent',
					prompt: 'what issue are you having?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { issueContent }) {
		const issuesChannel = this.client.channels.get(issuesChannelID);
		if (!issuesChannel || issuesChannel.type !== 'text') {
			return msg.reply(oneLine`
				the owner of this bot has not set a valid channel for issues,
				therefore this command is not available.
			`);
		}

		const openIssues = await Issue.count({
			where: {
				discoveredBy: msg.author.id,
				processed: false
			}
		});

		if (openIssues > 5) {
			return msg.reply(oneLine`
				you already have 5 open issues.
				Please wait for them to be processed before creating any new ones.
			`);
		}

		const issue = await Issue.create({
			discoveredBy: msg.author.id,
			issue: issueContent
		});
		const issueMessage = await issuesChannel.send({
			embed: {
				color: 0x30A9ED,
				author: {
					name: `${msg.author.tag} (${msg.author.id})`,
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: issueContent,
				timestamp: new Date(),
				footer: { text: `Issue #${issue.id}` }
			}
		});
		await issue.update({ issueMessage: issueMessage.id });

		return msg.reply('your issue has been acknowledged. Please wait until it has been reviewed.');
	}
};
