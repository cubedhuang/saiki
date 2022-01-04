import "dotenv/config";

import { Client, Intents } from "discord.js";

import avatars from "../data/avatars.json";
import { commands } from "./commands";
import { Lib } from "./lib";

{
	const time = (color: number) =>
		`\x1b[${color}m[${new Date().toISOString()}]\x1b[0m`;
	const make =
		(fn: (...args: unknown[]) => void, color: number) =>
		(message: unknown, ...args: unknown[]) =>
			fn(`${time(color)} ${message}`, ...args);

	console.log = make(console.log, 32);
	console.warn = make(console.warn, 33);
	console.error = make(console.error, 31);
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

let timeout: ReturnType<typeof setTimeout> | undefined;

function nextHourTimeout(fn: (...args: unknown[]) => unknown) {
	const nextHour = new Date().setHours(
		// next hour calculated with +1min to current time for small buffer
		new Date(Date.now() + 60 * 1000).getHours() + 1,
		0,
		0,
		0
	);
	return setTimeout(async () => await fn(), nextHour - Date.now());
}

async function randomAvatar() {
	if (timeout) clearTimeout(timeout);
	timeout = nextHourTimeout(() => randomAvatar());

	await client.user?.setAvatar(Lib.pickRandom(avatars)).then(user => {
		console.log(`Avatar changed to ${user.avatarURL({ size: 4096 })}`);
	});
}

client.on("ready", client => {
	console.log(`${client.user.tag} has logged in!`);
	client.user.setActivity("saiki help");

	timeout = nextHourTimeout(() => randomAvatar());
});

client.on("messageCreate", async message => {
	if (message.author.bot) return;

	if (message.content.toLowerCase() === "saiki") {
		await message.reply("...");
		return;
	}

	if (!/^saiki\s/i.test(message.content)) return;

	if (
		message.channel.type !== "DM" &&
		!message.channel
			.permissionsFor(client.user!)
			?.has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY"])
	)
		return;

	const [name, ...args] = message.content.substring(5).trim().split(/\s+/g);

	// cut off chars after stuff like ' and - for words like what's
	const command = commands.get(name.replace(/\W.*$/i, ""));

	if (!command) return;

	if ("run" in command) {
		await command.run.bind(command)(message, args);
		return;
	}

	await message.reply(Lib.pickRandom(command.replies));
});

client.login(process.env.TOKEN);
