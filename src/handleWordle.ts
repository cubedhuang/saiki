import type { Message } from "discord.js";

import { wordle } from "../data/wordle";

class TrieNode {
	children?: Record<string, TrieNode>;

	add(word: string) {
		if (word.length === 0) return;
		this.children ??= {};
		this.children[word[0]] ??= new TrieNode();
		this.children[word[0]].add(word.slice(1));
	}

	has(word: string): boolean {
		if (word.length === 0) return true;
		if (!this.children?.[word[0]]) return false;
		return this.children[word[0]].has(word.slice(1));
	}
}

const root = new TrieNode();

for (const word of wordle.answers) root.add(word);
for (const word of wordle.dictionary) root.add(word);

function isWordleWord(word: string) {
	return word.length === 5 && root.has(word.toLowerCase());
}

function capitalize(word: string) {
	return word[0].toUpperCase() + word.slice(1);
}

export async function handleWordle(message: Message) {
	const words = message.content.split(/\s+/);
	const isValidWords = words.every(isWordleWord);

	if (!isValidWords) return false;

	const unique = [...new Set(words)];

	if (unique.length === 1) {
		await message.reply(
			`${capitalize(unique[0])} is a valid Wordle guess.`
		);
	} else if (unique.length === 2) {
		await message.reply(
			`${capitalize(unique[0])} and ${capitalize(
				unique[1]
			)} are both valid Wordle guesses.`
		);
	} else {
		const list = unique.slice(0, -1).map(capitalize).join(", ");
		await message.reply(
			`${list}, and ${capitalize(
				unique[unique.length - 1]
			)} are all valid Wordle guesses.`
		);
	}

	return true;
}
