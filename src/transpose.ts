import { keys } from "./notes.js";
import { tryThing } from "./shared.js";

function transpose(notes: string, steps: number): string {
	return notes
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
				if (!autoshiftEle.checked) return "?";
				else {
					// must be able to divide somehow
					// possible to create duplicates in chords
					while (newPos < 0 || newPos >= keys.length) {
						newPos += 12 * (steps > 0 ? -1 : 1);
					}
				}
			}

			return keys[newPos];
		})
		.join("");
}

function clean(notes: string) {
	// group the keys
	return notes.replace(
		/\[(.*?)\]/g,
		(_, letters: string) =>
			"[" +
			// deduplicate things in chords that may be introduced by autoshift
			Array.from(new Set(letters.split("")))
				.sort((a, b) => {
					// symbol or upper
					if (!/[0-9]/.test(a) && a.toUpperCase() === a) {
						if (!/[0-9]/.test(b) && b.toUpperCase() === b) {
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

const transposeEle = document.getElementById("transpose") as HTMLButtonElement;
const inputEle = document.getElementById("input") as HTMLTextAreaElement;
const stepsEle = document.getElementById("shift") as HTMLInputElement;
const outputEle = document.getElementById("output") as HTMLOutputElement;
const autoshiftEle = document.getElementById("autoshift") as HTMLInputElement;

transposeEle.addEventListener("click", () => {
	tryThing(() => {
		const notes = inputEle.value;
		const steps = parseInt(stepsEle.value, 10);
		if (isNaN(steps)) {
			throw new Error(`Invalid steps: ${stepsEle.value}`);
		}
		const result = clean(transpose(notes, steps));
		outputEle.value = result;
	});
});
