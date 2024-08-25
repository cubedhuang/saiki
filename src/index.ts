import "dotenv/config";

import { Client, Intents } from "discord.js";
import { URL } from "node:url";

import { handleMessage } from "./handleMessage.js";

const AVATAR_COUNT = 11;

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

	const i = Math.floor(Math.random() * AVATAR_COUNT);

	const path = new URL(`../src/img/${i}.jpg`, import.meta.url).pathname;

	await client.user?.setAvatar(path).then(user => {
		console.log(`Avatar changed to ${user.avatarURL({ size: 4096 })}`);
	});
}

client.on("ready", client => {
	console.log(`${client.user.tag} has logged in!`);
	client.user.setActivity("saiki help");

	timeout = nextHourTimeout(() => randomAvatar());
});

client.on("messageCreate", handleMessage);

await client.login(process.env.TOKEN);
