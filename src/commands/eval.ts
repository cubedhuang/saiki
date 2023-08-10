import { MessageEmbed } from "discord.js";
import { inspect } from "node:util";

import { Command } from "./index.js";

export const evalCommand: Command = {
	name: "eval",
	aliases: ["ev"],
	async run(message, args) {
		if (!message.client.application?.owner?.id)
			await message.client.application?.fetch();
		if (message.client.application?.owner?.id !== message.author.id) return;

		const code = args.join(" ");

		const embed = new MessageEmbed()
			.setTitle("Eval")
			.setDescription(`\`\`\`js\n${code}\`\`\``)
			.setColor("#11bd18");

		function formatOutput(s: unknown) {
			return `\`\`\`js\n${inspect(s)
				.replaceAll(message.client.token!, "CLIENT TOKEN")
				.slice(0, 1000)}\`\`\``;
		}

		try {
			const result = await eval(code);
			embed.addField("Result", formatOutput(result));
			await message.reply({ embeds: [embed] });
		} catch (e) {
			embed.addField("Error", formatOutput(e));
			await message.reply({ embeds: [embed] });
		}
	}
};
