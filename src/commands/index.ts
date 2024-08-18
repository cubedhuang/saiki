import { Collection, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { URL } from "node:url";

import { coffeeJellyReplies } from "../data/coffeeJellyReplies.js";
import { Lib } from "../lib.js";
import { Command } from "./Command.js";
import { evalCommand } from "./eval.js";
import { helpCommand } from "./help.js";

export { Command } from "./Command.js";

export const commands = ((commands: Command[]) => {
	const cmds = new Collection<string, Command>();
	for (const command of commands) {
		cmds.set(command.name, command);
		for (const alias of command.aliases ?? []) {
			cmds.set(alias, command);
		}
	}
	return cmds;
})([
	helpCommand,
	evalCommand,
	{
		name: "please",
		aliases: ["please", "plz", "pls"],
		replies: Lib.yareYare
	},
	{
		name: "kusuo",
		aliases: ["k"],
		replies: [
			"Ordinary people sure are a pain.",
			"There's no such thing as a person without thoughts.",
			"No matter how big an accident is, it's triggered by a minor thing, so a minor change can avoid it entirely.",
			"I'm never using my annoyed face ever again.",
			"I am the world's unhappiest man who has had everything snatched away since the moment of my birth."
		]
	},
	{
		name: "coffee",
		aliases: ["jelly"],
		replies: coffeeJellyReplies,
		async run(message) {
			const embed = new MessageEmbed()
				.setImage(Lib.pickRandom(this.replies!))
				.setColor("#11bd18");
			await message.reply({ embeds: [embed] });
		}
	},
	{
		name: "can",
		aliases: [
			"who",
			"what",
			"when",
			"where",
			"may",
			"does",
			"am",
			"is",
			"are",
			"do",
			"will",
			"can"
		],
		replies: [
			"*ignores you\\*",
			"You know that.",
			"Really, I don't care about your problems.",
			...Lib.yareYare
		]
	},
	{
		name: "why",
		aliases: ["how"],
		replies: [
			"*walks past you\\*",
			"You know that.",
			"Really, I don't care about your problems.",
			"Go complain to the author.",
			...Lib.yareYare
		]
	},
	{
		name: "say",
		aliases: ["speak", "talk"],
		async run(message, _, raw) {
			await message.delete();
			await message.channel.send(raw);
		}
	},
	{
		name: "solve",
		aliases: ["find", "calculate"],
		async run(message, _, raw) {
			if (!raw.length) {
				await message.reply("Solve what?");
				return;
			}

			const url = new URL("http://api.wolframalpha.com/v1/result");

			url.searchParams.append("appid", process.env.WOLFRAM_ID!);
			url.searchParams.append("i", raw);
			url.searchParams.append("units", "metric");
			const response = await fetch(url.toString()).then(res =>
				res.text()
			);

			if (response === "Wolfram|Alpha did not understand your input") {
				await message.reply("What are you talking about?");
			} else if (response === "No short answer available") {
				await message.reply(
					"I could solve this, but it would take too long."
				);
			} else {
				await message.reply(`Why are you asking me this? ${response}.`);
			}
		}
	}
]);
