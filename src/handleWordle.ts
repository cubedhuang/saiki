import type { Message } from "discord.js";

import { wordle } from "./data/wordle.js";

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
	return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export async function handleWordle(message: Message) {
	const words = message.content.split(/\s+/);
	const isValidWords = words.every(isWordleWord);

	if (!isValidWords) return false;

	await message.react("1025939109329514546");

	return true;
}
