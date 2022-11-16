let timer: any;

export function throttle(callback: () => void) {
	if (!timer) {
		timer = setTimeout(() => {
			timer = 0;
			callback();
		}, 100);
	}
}
