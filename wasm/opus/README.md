## Development Environment

First, set up your [emscripten/WASM development environment](https://webassembly.org/getting-started/developers-guide/).

## Build Opus

```bash
tar xf opus-1.2.1.tar.gz
cd opus-1.2.1
./configure --disable-asm --disable-intrinsics --enable-shared=no
make CC=emcc
```
Compilation will error on tests, but `libopus.a` will already be built.

## Build the WASM
```bash
cd ..
make
```

If all goes well, you should be left with `opus.js` and `opus.wasm`. The `.js` file acts like a header to incorporate the WASM into your project.

## Usage

```js
import opusModule from './opus.js';

let encodeU8;
let decodeF32;

const opus = opusModule({
    onRuntimeInitialized: () => {
        opus.ccall('init', 'number');

        const encodePtr = this.opus.ccall('encode_buf', 'number');
        const decodePtr = this.opus.ccall('decode_buf', 'number');
        encodeU8 = new Uint8Array(this.opus.HEAPU8.buffer, encodePtr);
        decodeF32 = new Float32Array(this.opus.HEAPF32.buffer, decodePtr);
        
        ...
    }
});
```

```js
encodeU8.set(new Uint8Array(packet));

const frames = opus.ccall('decode', 'number', ['number'], [packet.byteLength]);
```

The `decode` call will leave the decoded PCM data in the `decodeF32` buffer.
