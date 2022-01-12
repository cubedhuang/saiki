import { Collection, Message, MessageEmbed } from "discord.js";

import coffeeJellyReplies from "../../data/coffeeJellyReplies.json";
import { Lib } from "../lib";
import { Command } from "./Command";
import { evalCommand } from "./eval";
import { helpCommand } from "./help";

export { Command } from "./Command";

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
			"do"
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
	}
]);
