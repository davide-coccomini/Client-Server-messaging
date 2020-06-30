CC=gcc
CFLAGS =-Wall
DEPS = client.c

%.o: %.c $(DEPS)
	$(CC) $(DEPS) -c -o client  $(CFLAGS)

client:
	$(CC) $(DEPS) -o client $(CFLAGS)

reset:
	rm -rf client
	rm -rf %.o

run:
	./client "127.0.0.1" 8081 "127.0.0.1" 4242
