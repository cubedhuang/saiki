import { Collection } from "discord.js";

interface Trigger {
	names: string[];
	replies: string[];
}

export const triggers = ((triggers: Trigger[]) => {
	const coll = new Collection<string, Trigger>();
	for (const trigger of triggers) {
		for (const name of trigger.names) {
			coll.set(name, trigger);
		}
	}
	return coll;
})([
	{
		names: ["offu", "oh wow"],
		replies: ["Nuisance number 4. The worst of them all."]
	},
	{
		names: ["ossu"],
		replies: ["What's with that accent?!"]
	},
	{
		names: ["815", "8:15", "8/15"],
		replies: ["it is sans o clock"]
	}
]);
