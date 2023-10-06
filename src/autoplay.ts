import { keys } from "./notes.js";
import { tryThing } from "./shared.js";

// a4 is the reference note
// -9 is the offset of c3
// we offset by a customizable amount of octaves because too low sounds bad
const a4 = 440;
const initialOffsetOctaves = -1;
const initialOffset = -9 + initialOffsetOctaves * 12;

let audioContext = new AudioContext();
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

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
			delay += baseDelay;
			inChord = false;
			continue;
		}

		const idx = keys.indexOf(note);

		// only play note if it's valid
		if (idx !== -1) {
			playNote(idx, delay, baseDelay * 1.1);
		}

		if (!inChord) {
			delay += baseDelay;
		}
	}
}

function playNote(i: number, delay: number, playFor: number) {
	const oscillator = audioContext.createOscillator();
	oscillator.type = "triangle";
	oscillator.connect(gainNode);
	oscillator.frequency.value = 2 ** ((initialOffset + i) / 12) * a4;
	oscillator.start(audioContext.currentTime + delay / 1000);
	oscillator.stop(audioContext.currentTime + (delay + playFor) / 1000);
}

function setupAudioContext() {
	audioContext.close();
	audioContext = new AudioContext();
	gainNode = audioContext.createGain();
	gainNode.connect(audioContext.destination);
	setVolume();
}

function setVolume() {
	// check parse? but it's a range
	const pct = parseInt(volumeEle.value, 10) / parseInt(volumeEle.max, 10);
	gainNode.gain.setValueAtTime(pct, audioContext.currentTime);
}

const autoplayEle = document.getElementById("autoplay") as HTMLButtonElement;
const stopEle = document.getElementById("stopplay") as HTMLButtonElement;
const inputEle = document.getElementById("input") as HTMLTextAreaElement;
const delayEle = document.getElementById("delay") as HTMLInputElement;
const volumeEle = document.getElementById("volume") as HTMLInputElement;

stopEle.addEventListener("click", () => setupAudioContext());

setVolume();
volumeEle.addEventListener("input", () => setVolume());

autoplayEle.addEventListener("click", () => {
	tryThing(() => {
		const notes = inputEle.value;
		const delay = 60000 / parseInt(delayEle.value, 10);
		if (isNaN(delay)) {
			throw new Error(`Invalid delay: ${delayEle.value}`);
		}
		play(notes, delay);
	});
});
