import "dotenv/config";

import { Client, Collection, Intents, Message, MessageEmbed } from "discord.js";
import { inspect } from "node:util";

import avatars from "./avatars.json";
import coffeeJellyReplies from "./coffeeJellyReplies.json";

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

	await client.user
		?.setAvatar(avatars[Math.floor(Math.random() * avatars.length)])
		.then(user => {
			console.log(`Avatar changed to ${user.avatarURL()}`);
		});
}

client.on("ready", client => {
	console.log(`${client.user.tag} has logged in!`);
	client.user.setActivity("saiki help");

	timeout = nextHourTimeout(() => randomAvatar());
});

interface BaseCommand {
	name: string;
	aliases?: string[];
}

interface RepliesCommand extends BaseCommand {
	replies: string[];
}

interface RunCommand extends BaseCommand {
	replies?: string[];
	run(this: this, message: Message, args: string[]): unknown;
}

type Command = RepliesCommand | RunCommand;

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
		name: "eval",
		aliases: ["ev"],
		async run(message, args) {
			if (!client.application?.owner?.id)
				await client.application?.fetch();
			if (client.application?.owner?.id !== message.author.id) return;

			const code = args.join(" ");

			const embed = new MessageEmbed()
				.setTitle("Eval")
				.setDescription(`\`\`\`js\n${code}\n\`\`\``)
				.setColor("#11bd18");

			try {
				const result = await eval(code);
				embed.addField(
					"Result",
					`\`\`\`js\n${inspect(result).replaceAll(
						client.token!,
						"CLIENT TOKEN"
					)}\n\`\`\``
				);
				await message.reply({ embeds: [embed] });
			} catch (e) {
				embed.addField("Error", `\`\`\`js\n${inspect(e)}\n\`\`\``);
				await message.reply({ embeds: [embed] });
			}
		}
	},
	{
		name: "help",
		aliases: ["please", "plz", "pls"],
		replies: ["Yare yare.", "Good grief.", "What a pain.", "やれやれ。"]
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
				.setImage(
					this.replies![
						Math.floor(Math.random() * this.replies!.length)
					]
				)
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
			"are"
		],
		replies: [
			"*ignores you\\*",
			"You know that.",
			"Really, I don't care about your problems.",
			"It's really obvious, but you don't know it."
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
			"It's really obvious, but you don't know it."
		]
	}
]);

client.on("messageCreate", async message => {
	if (message.author.bot) return;

	if (!/^saiki\s/i.test(message.content)) return;

	const [cmd, ...args] = message.content.substring(5).trim().split(/\s+/g);

	const command = commands.get(cmd);

	if (!command) return;

	if ("run" in command) {
		await command.run.bind(command)(message, args);
	} else {
		await message.reply(
			command.replies[Math.floor(Math.random() * command.replies.length)]
		);
	}
});

client.login(process.env.TOKEN);
