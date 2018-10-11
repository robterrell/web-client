const GP_TIMEOUT = 20;
const MAX_GAMEPADS = 4;

export class GamepadManager {
	constructor(onButton, onAxis, onDisconnect) {
		this.onButton = onButton;
		this.onAxis = onAxis;
		this.onDisconnect = onDisconnect;
		this.state = {};

		this.interval = setInterval(() => {
			this._poll();
		}, GP_TIMEOUT);
	}

	_poll() {
		const gamepads = navigator.getGamepads();

		for (let i = 0; i < MAX_GAMEPADS; i++) {
			if (gamepads[i]) {
				let gp = this.state[i];

				if (!gp)
					gp = this.state[i] = {axes: [], buttons: []};

				for (let x = 0; x < gamepads[i].buttons.length; x++) {
					const value = gamepads[i].buttons[x].value;

					if (gp.buttons[x] !== undefined && gp.buttons[x] !== value) //eslint-disable-line no-undefined
						this.onButton(i, x, value);

					gp.buttons[x] = value;
				}

				for (let x = 0; x < gamepads[i].axes.length; x++) {
					let val = gamepads[i].axes[x];
					if (Math.abs(val) < 0.05) val = 0;

					if (gp.axes[x] !== undefined && gp.axes[x] !== val) //eslint-disable-line no-undefined
						this.onAxis(i, x, val);

					gp.axes[x] = val;
				}

			} else if (this.state[i]) {
				delete this.state[i];
				this.onDisconnect(i);
			}
		}
	}

	destroy() {
		clearInterval(this.interval);
	}
}
