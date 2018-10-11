// Util modules
import * as Util from './util.js';

export class VideoPlayer {
	constructor(element, onFatal) {
		this.element = element;
		this.onFatal = onFatal;
		this.videoSource = null;
		this.mediaSource = null;
		this.waitingForKeyFrame = true;
		this.listeners = [];
		this.queue = [];
	}

	_submit() {
		if (this.queue.length > 0 && this.videoSource && !this.videoSource.updating) {
			try {
				const frame = this.queue.shift();
				this.videoSource.appendBuffer(frame);

			} catch (error) {
				console.warn(error);
				this.destroy();
				this.onFatal();
			}
		}
	}

	_init() {
		this.mediaSource = new MediaSource();
		this.element.src = URL.createObjectURL(this.mediaSource);
		this.element.load();

		this.listeners.push(Util.addListener(this.element, 'error', () => {
			console.error(this.element.error.message);
		}));

		this.listeners.push(Util.addListener(this.mediaSource, 'sourceopen', () => {
			this.videoSource = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001e"');
			this.listeners.push(Util.addListener(this.videoSource, 'update', this._submit, this));
			this.element.play();
		}));
	}

	_reinit() {
		this.destroy();
		this._init();
	}

	destroy() {
		this.waitingForKeyFrame = true;
		this.element.pause();

		Util.removeListeners(this.listeners);
		this.listeners = [];

		if (this.mediaSource) {
			if (this.videoSource) {
				this.mediaSource.removeSourceBuffer(this.videoSource);
				this.videoSource = null;
			}

			this.mediaSource.endOfStream();
			URL.revokeObjectURL(this.element.src);
			this.mediaSource = null;
		}
	}

	push(data) {
		const frame = new Uint8Array(data);

		if (frame[4] === 0x66) {
			this._reinit();
			this.waitingForKeyFrame = false;
		}

		if (!this.waitingForKeyFrame) {
			this.queue.push(frame);
			this._submit();
		}
	}
}
