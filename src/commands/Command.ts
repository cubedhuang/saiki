import type { Message } from "discord.js";

interface BaseCommand {
	name: string;
	aliases?: string[];
}

interface RepliesCommand extends BaseCommand {
	replies: string[];
}

interface RunCommand extends BaseCommand {
	replies?: string[];
	run(this: this, message: Message, args: string[], rawArgs: string): unknown;
}

export type Command = RepliesCommand | RunCommand;
