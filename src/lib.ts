export abstract class Lib extends null {
	static readonly yareYare = [
		"Yare yare.",
		"Good grief.",
		"What a pain.",
		"やれやれ。"
	];

	static pickRandom(array: any[]) {
		return array[Math.floor(Math.random() * array.length)];
	}
}
