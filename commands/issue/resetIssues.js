const { Command } = require('discord.js-commando');

const Issue = require('../../models/Issue');

module.exports = class ResetIssuesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reset-issues',
			group: 'issue',
			memberName: 'reset-issues',
			description: 'Reset the issues data table.',
			guildOnly: true,

			args: [
				{
					key: 'confirmation',
					prompt: 'are you sure you want to reset the issue data table?\n',
					type: 'string',
					validate: confirmation => {
						if (!/^(?:yes|y|-y)$/g.test(confirmation)) {
							return `
								please confirm the reset of the data table with either \`yes\`, \`y\`, or \`-y\`
							`;
						}
						return true;
					}
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	run(msg) {
		Issue.sync({ force: true });
		return msg.reply('the issue data table has been reset.');
	}
};
