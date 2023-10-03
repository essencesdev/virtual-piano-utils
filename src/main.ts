const keys = [
	"{lft}",
	"{LFT}",
	"{rght}",
	"{f1}",
	"{F1}",
	"{f2}",
	"{F2}",
	"{f3}",
	"{f4}",
	"{F4}",
	"{f5}",
	"{F5}",
	"{f6}",
	"{F6}",
	"{f7}",
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
	"{ins}",
	"{INS}",
	"{hom}",
	"{pup}",
	"{PUP}",
	"{del}",
	"{DEL}",
	"{end}",
	"{END}",
	"{pdn}",
	"{upa}",
];

function t(notes: string, steps: number): string {
	// TODO: handle extended keys
	return notes
		.split("")
		.map((key, i) => {
			const pos = keys.findIndex((note) => note === key);
			if (pos === -1) return key; // assume this is other notation
			const newPos = pos + steps;
			if (newPos < 0 || newPos >= keys.length) {
				throw new Error(
					`detected key outside of range: ${key}` +
						`, at position: ${i};${notes.slice(i - 3, i + 3)}`
				);
			}
			return keys[pos + steps];
		})
		.join("");
}

const transposeEle = document.getElementById("transpose") as HTMLButtonElement;
const inputEle = document.getElementById("input") as HTMLTextAreaElement;
const stepsEle = document.getElementById("shift") as HTMLInputElement;
const outputEle = document.getElementById("output") as HTMLOutputElement;
const errorEle = document.getElementById("error") as HTMLSpanElement;

transposeEle.addEventListener("click", () => {
	errorEle.innerText = "";
	try {
		const notes = inputEle.value;
		const steps = parseInt(stepsEle.value, 10);
		if (isNaN(steps)) {
			throw new Error(`Invalid steps: ${stepsEle.value} - ${steps}`);
		}
		const result = t(notes, steps);
		outputEle.value = result;
	} catch (e) {
		console.error(e);
		errorEle.innerText = String(e);
	}
});
