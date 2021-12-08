import "dotenv/config";

import { Client, Collection, Intents, Message } from "discord.js";

{
	const { log, warn, error } = console;

	const time = (color: number) =>
		`\x1b[${color}m[${new Date().toISOString()}]\x1b[0m`;

	console.log = (...args: unknown[]) => log(time(32), ...args);
	console.warn = (...args: unknown[]) => warn(time(33), ...args);
	console.error = (...args: unknown[]) => error(time(31), ...args);
}

["uncaughtException", "unhandledRejection"].forEach(event =>
	process.on(event, e => {
		console.error(e);
	})
);

const client = new Client({
	intents: Object.values(Intents.FLAGS),
	allowedMentions: {
		repliedUser: false,
		parse: ["users", "roles"]
	}
});

client.on("ready", client => {
	console.log(`${client.user.tag} has logged in!`);
	client.user.setActivity("saiki help");
});

interface Command {
	name: string;
	aliases?: string[];
	run(this: this, message: Message, args: string[]): unknown;
	[key: string]: unknown;
}

function toCommandCollection(commands: Command[]) {
	const cmds = new Collection<string, Command>();
	for (const command of commands) {
		cmds.set(command.name, command);
		for (const alias of command.aliases ?? []) {
			cmds.set(alias, command);
		}
	}
	return cmds;
}

const commands = toCommandCollection([
	{
		name: "help",
		async run(message) {
			const replies = [
				"Yare yare.",
				"Good grief.",
				"What a pain.",
				"やれやれ。"
			];
			await message.reply(
				replies[Math.floor(Math.random() * replies.length)]
			);
		}
	},
	{
		name: "kusuo",
		aliases: ["k"],
		async run(message) {
			const replies = [
				"Ordinary people sure are a pain.",
				"There’s no such thing as a person without thoughts.",
				"No matter how big an accident is, it’s triggered by a minor thing, so a minor change can avoid it entirely.",
				"I’m never using my annoyed face ever again.",
				"I am the world’s unhappiest man who has had everything snatched away since the moment of my birth."
			];
			await message.reply(
				replies[Math.floor(Math.random() * replies.length)]
			);
		}
	}
]);

client.on("messageCreate", message => {
	if (!message.content.startsWith("saiki")) return;

	const [cmd, ...args] = message.content.substring(5).trim().split(/\s+/g);

	commands.get(cmd)?.run(message, args);
});

client.login(process.env.TOKEN);
