import { keys } from "./notes.js";

// a4 is the reference note
// -9 is the offset of c3
// we offset by a customizable amount of octaves because too low sounds bad
const a4 = 440;
const initialOffsetOctaves = -1;
const initialOffset = -9 + initialOffsetOctaves * 12;

let audioContext = new AudioContext();

const autoplayEle = document.getElementById("autoplay") as HTMLButtonElement;
const stopEle = document.getElementById("stopplay") as HTMLButtonElement;
const inputEle = document.getElementById("input") as HTMLTextAreaElement;
const delayEle = document.getElementById("delay") as HTMLInputElement;
const errorEle = document.getElementById("error") as HTMLSpanElement;

function play(notes: string, baseDelay: number) {
	let delay = 0;
	let inChord = false;
	for (const note of notes.split("")) {
		// chord notation, don't delay but keep track
		if (note === "[") {
			inChord = true;
			continue;
		}

		if (note === "]") {
			inChord = false;
			continue;
		}

		const idx = keys.indexOf(note);
		// unknown symbol, probably timing related, delay
		if (idx === -1) {
			delay += baseDelay;
			continue;
		}

		playNote(idx, delay, baseDelay);
		if (!inChord) {
			delay += baseDelay;
		}
	}
}

function playNote(i: number, delay: number, playFor: number) {
	const oscillator = audioContext.createOscillator();
	oscillator.type = "sine";
	oscillator.connect(audioContext.destination);
	oscillator.frequency.value = 2 ** ((initialOffset + i) / 12) * a4;
	oscillator.start(audioContext.currentTime + delay / 1000);
	oscillator.stop(audioContext.currentTime + (delay + playFor) / 1000);
}

autoplayEle.addEventListener("click", () => {
	errorEle.innerText = "";
	try {
		const notes = inputEle.value;
		const delay = parseInt(delayEle.value, 10);
		if (isNaN(delay)) {
			throw new Error(`Invalid delay: ${delayEle.value}`);
		}
		play(notes, delay);
	} catch (e) {
		console.error(e);
		errorEle.innerText = String(e);
	}
});

stopEle.addEventListener("click", () => {
	audioContext.close();
	audioContext = new AudioContext();
});
