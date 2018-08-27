CC=gcc
CFLAGS =-Wall
DEPS = ./server/server.c
SEPC = ./client/client.c

%.o: %.c $(DEPS)
	$(CC) $(DEPS) -c -o ./server/server.c $(CFLAGS)
	$(CC) $(DEPC) -c -o ./client/client.c $(CFLAGS)

compile:
	$(CC) $(DEPS) -o ./server/server $(CFLAGS)
	$(CC) $(DEPC) -o ./client/client $(CFLAGS)
	Compilazione completata

reset:
	rm -rf ./server/server
	rm -rf ./server/%.o
	rm -rf ./client/client
	rm -rf ./client/%.o
	Reset del progetto completato


