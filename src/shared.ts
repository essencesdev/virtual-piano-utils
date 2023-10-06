const errorEle = document.getElementById("error") as HTMLSpanElement;

export function tryThing(z: (...args: unknown[]) => unknown) {
	errorEle.innerText = "";
	try {
		z();
	} catch (e) {
		console.error(e);
		errorEle.innerText = String(e);
	}
}
