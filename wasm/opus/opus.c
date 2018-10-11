#include <stdlib.h>
#include <string.h>

#include <emscripten.h>

#include "opus.h"

struct opus {
	OpusDecoder *decoder;
	uint8_t *encode_buf;
	float *decode_buf;
} CTX;

#define DECODE_BUF_SIZE (8 * 1024)
#define ENCODE_BUF_SIZE (4 * 1024)

static void log_e_str(char *str, int32_t e)
{
	printf("%s=%d\n", str, e);
}

EMSCRIPTEN_KEEPALIVE
int32_t init(void)
{
	memset(&CTX, 0, sizeof(struct opus));

	if (CTX.decoder)
		opus_decoder_destroy(CTX.decoder);

	int32_t e = !OPUS_OK;
	CTX.decoder = opus_decoder_create(48000, 2, &e);
	if (e != OPUS_OK) {log_e_str("opus_decoder_create", e); return -1;}

	CTX.encode_buf = malloc(ENCODE_BUF_SIZE);
	CTX.decode_buf = malloc(DECODE_BUF_SIZE);

	return 0;
}

EMSCRIPTEN_KEEPALIVE
uint8_t *encode_buf(void)
{
	return CTX.encode_buf;
}

EMSCRIPTEN_KEEPALIVE
float *decode_buf(void)
{
	return CTX.decode_buf;
}

EMSCRIPTEN_KEEPALIVE
int32_t decode(int32_t encoded_size)
{
	if (!CTX.decoder) return -1;

	int32_t num_frames = opus_decode_float(CTX.decoder, CTX.encode_buf, encoded_size, CTX.decode_buf, DECODE_BUF_SIZE, 0);
	if (num_frames <= 0) {log_e_str("opus_decode", num_frames); return -1;}

	return num_frames;
}

EMSCRIPTEN_KEEPALIVE
void cleanup(void)
{
	if (!CTX.decoder) return;

	opus_decoder_destroy(CTX.decoder);
	free(CTX.encode_buf);
	free(CTX.decode_buf);
}
