import { Message } from "discord.js";

import { Command, commands } from "./commands/index.js";
import { handleWordle } from "./handleWordle.js";
import { Lib } from "./lib.js";
import { triggers } from "./triggers.js";

export async function handleMessage(message: Message) {
	if (message.author.bot) return;

	if (await handleWordle(message)) return;

	if (message.content.toLowerCase() === "saiki") {
		await message.reply("...");
		return;
	}

	if (
		message.channel.type !== "DM" &&
		!message.channel
			.permissionsFor(message.client.user!)
			?.has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY"])
	)
		return;

	const commandData = getCommandData(message);

	if (commandData) {
		const [command, args, rawArgs] = commandData;
		if ("run" in command) {
			await command.run(message, args, rawArgs);
		} else {
			const reply = Lib.pickRandom(command.replies);
			await message.reply(reply);
		}
		return;
	}

	// handle triggers
	const trigger = triggers.find(t =>
		t.names.some(n => message.content.includes(n))
	);

	if (!trigger) return;

	const reply = Lib.pickRandom(trigger.replies);
	await message.reply(reply);
}

function getCommandData(message: Message): [Command, string[], string] | null {
	if (!/^saiki\s/i.test(message.content)) return null;

	const [name, ...args] = message.content.substring(5).trim().split(/\s+/g);
	const rawArgs = message.content
		.substring(5)
		.trim()
		.substring(name.length)
		.trim();

	// cut off chars after stuff like ' and - for words like what's
	const command = commands.get(name.replace(/\W.*$/i, ""));

	if (!command) return null;

	return [command, args ?? [], rawArgs];
}
