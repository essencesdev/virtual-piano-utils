const keys = [
	"1",
	"!",
	"2",
	"@",
	"3",
	"4",
	"$",
	"5",
	"%",
	"6",
	"^",
	"7",
	"8",
	"*",
	"9",
	"(",
	"0",
	"q",
	"Q",
	"w",
	"W",
	"e",
	"E",
	"r",
	"t",
	"T",
	"y",
	"Y",
	"u",
	"i",
	"I",
	"o",
	"O",
	"p",
	"P",
	"a",
	"s",
	"S",
	"d",
	"D",
	"f",
	"g",
	"G",
	"h",
	"H",
	"j",
	"J",
	"k",
	"l",
	"L",
	"z",
	"Z",
	"x",
	"c",
	"C",
	"v",
	"V",
	"b",
	"B",
	"n",
	"m",
	"M",
];

const transposeEle = document.getElementById("transpose") as HTMLButtonElement;
const inputEle = document.getElementById("input") as HTMLTextAreaElement;
const stepsEle = document.getElementById("shift") as HTMLInputElement;
const outputEle = document.getElementById("output") as HTMLOutputElement;
const errorEle = document.getElementById("error") as HTMLSpanElement;
const autoshiftEle = document.getElementById("autoshift") as HTMLInputElement;

function t(notes: string, steps: number): string {
	// TODO: handle extended keys
	const transposedNotes = notes
		.split("")
		.map((key, i) => {
			const pos = keys.indexOf(key);
			if (pos === -1)
				if (/[a-z]/i.test(key))
					throw new Error(
						`detected invalid key: ${key}` +
							`, at position: ${i};${notes.slice(i - 5, i + 5)}`
					);
				else return key; // probably a non-note symbol
			let newPos = pos + steps;
			if (newPos < 0 || newPos >= keys.length) {
				if (!autoshiftEle.checked)
					throw new Error(
						`detected key outside of range: ${key}` +
							`, at position: ${i};${notes.slice(i - 5, i + 5)}`
					);
				else {
					// must be able to divide somehow
					while (newPos < 0 || newPos >= keys.length) {
						newPos += 12 * (steps > 0 ? -1 : 1);
					}
				}
			}
			return keys[newPos];
		})
		.join("");

	// group the keys
	return transposedNotes.replace(
		/\[(.*?)\]/g,
		(_, letters: string) =>
			"[" +
			letters
				.split("")
				.sort((a, b) => {
					// symbol or upper
					if (!/[0-9]/.test(a) && a.toUpperCase() === a) {
						if (!/[0-9]/.test(b) && b.toUpperCase() === b) {
							console.log(a, b, keys.indexOf(a), keys.indexOf(b));
							return keys.indexOf(a) - keys.indexOf(b);
						}
						return -1;
					}

					// a is lower or number
					// give b if not number or is upper
					if (!/[0-9]/.test(b) && b.toUpperCase() === b) return 1;

					// lower
					return keys.indexOf(a) - keys.indexOf(b);
				})
				.join("") +
			"]"
	);
}

transposeEle.addEventListener("click", () => {
	errorEle.innerText = "";
	try {
		const notes = inputEle.value;
		const steps = parseInt(stepsEle.value, 10);
		if (isNaN(steps)) {
			throw new Error(`Invalid steps: ${stepsEle.value}`);
		}
		const result = t(notes, steps);
		outputEle.value = result;
	} catch (e) {
		console.error(e);
		errorEle.innerText = String(e);
	}
});
