export function addListener(obj, name, func, ctx) {
	const newFunc = ctx ? func.bind(ctx) : func;
	obj.addEventListener(name, newFunc);

	return [obj, name, newFunc];
}

export function removeListeners(listeners) {
	for (const listener of listeners)
		listener[0].removeEventListener(listener[1], listener[2]);
}
