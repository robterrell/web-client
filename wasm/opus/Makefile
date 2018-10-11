NAME = opus

CC = emcc
CFLAGS = -Iopus-1.2.1/include/

OBJS = opus.o
LIBS = opus-1.2.1/.libs/libopus.a

EMCC_COMMAND = \
	$(CC) $(OBJS) $(LIBS) \
	-O3 \
	-s WASM=1 \
	-s MODULARIZE=1 \
	-s EXPORT_ES6=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall'] \
	-o $(NAME).js

all: clean clear $(OBJS)
	$(EMCC_COMMAND)

install: all
	cp $(NAME).js ../../src/wasm/
	cp $(NAME).wasm ../../src/wasm/

clean:
	rm -rf $(OBJS)
	rm -rf *.js
	rm -rf *.wasm

clear:
	clear
