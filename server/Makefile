CC=gcc
CFLAGS =-Wall
DEPS = server.c

%.o: %.c $(DEPS)
	$(CC) $(DEPS) -c -o server  $(CFLAGS)

server:
	$(CC) $(DEPS) -o server $(CFLAGS)

reset:
	rm -rf server
	rm -rf %.o
