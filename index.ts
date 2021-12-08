import "dotenv/config";

import { Client, Intents } from "discord.js";

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

const REPLIES = ["Yare yare.", "Good grief.", "What a pain.", "やれやれ。"];

client.on("messageCreate", message => {
	if (message.content === "saiki help") {
		message.reply(REPLIES[Math.floor(Math.random() * REPLIES.length)]);
	}
});

client.login(process.env.TOKEN);
