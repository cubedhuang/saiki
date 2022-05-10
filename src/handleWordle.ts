import type { Message } from "discord.js";

import wordle from "../data/wordle.json" assert { type: "json" };

export async function handleWordle(message: Message) {
	if (!message.content.match(/^[a-zA-Z]{5}$/)) return false;

	const word = message.content.toLowerCase();

	if (!wordle.answers.includes(word) && !wordle.dictionary.includes(word)) {
		return false;
	}

	const capitalized = word[0].toUpperCase() + word.slice(1);
	await message.reply(`${capitalized} is a valid Wordle guess.`);

	return true;
}
