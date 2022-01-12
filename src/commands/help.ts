import { Collection } from "discord.js";

import { Lib } from "../lib";
import { Command } from ".";

function help(again = false) {
	return `
${Lib.pickRandom(Lib.yareYare)} I suppose I'll explain myself${
		again ? " to you again." : ""
	}.
saiki coffee jelly : pictures
You can ask me anything, but don't count on an answer.
`.trim();
}

function notHelp() {
	return `
${Lib.pickRandom(
	Lib.yareYare
)} I'm not explaining that again to you for a while. Use the other message.
`.trim();
}

const users = new Collection<string, number>();

export const helpCommand: Command = {
	name: "help",
	aliases: ["commands"],
	async run(message) {
		if (!users.has(message.author.id)) {
			users.set(
				message.author.id,
				Date.now() + Math.random() * 5_000_000 + 5_000_000
			);
			await message.reply(help());
			return;
		}

		const time = users.get(message.author.id)!;

		if (Date.now() < time) {
			await message.reply(notHelp());
			return;
		}

		users.set(
			message.author.id,
			Date.now() + Math.random() * 5_000_000 + 5_000_000
		);
		await message.reply(help(true));
	}
};
