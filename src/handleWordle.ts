import type { Message } from "discord.js";

import wordle from "../data/wordle.json";

export async function handleWordle(message: Message) {
	if (!message.content.match(/^[a-zA-Z]{5}$/i)) return false;

	if (
		!wordle.answers.includes(message.content) &&
		!wordle.dictionary.includes(message.content)
	) {
		return false;
	}

	const word =
		message.content[0].toUpperCase() +
		message.content.slice(1).toLowerCase();
	await message.reply(`${word} is a valid Wordle guess.`);

	return true;
}
