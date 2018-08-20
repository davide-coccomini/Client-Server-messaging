
#include <string.h>
#include <stdio.h>
#include <netinet/in.h>
#include <sys/mman.h>
#include <stdlib.h>

struct Message {
    char sender[1024];
    char message[10000];
    struct Message *next;
};

struct User {
    char address[INET_ADDRSTRLEN];
    char username[INET_ADDRSTRLEN];
    int port;
    int online;

    struct Message *messageList;
};

struct Inbox {
    int top;
    struct User users[100];
};

struct Inbox *inbox;


void* initializeSharedVariable(size_t size) {
    int protection = PROT_READ | PROT_WRITE;
    int visibility = MAP_ANONYMOUS | MAP_SHARED;
    return mmap(NULL, size, protection, visibility, 0, 0);
}

void initInbox() {
    inbox = initializeSharedVariable(sizeof(inbox));
    //memset(inbox, 0, sizeof(inbox));
}

void appendMessage(struct Message *list, struct Message *mess) {
    struct Message *message = (struct Message *)malloc(sizeof(message));

    if (message == NULL) { return; }

    strcpy(message->message, mess->message);
    strcpy(message->sender, message->sender);
    message->next = NULL;

    if (list->next == NULL) {
        list->next = message;

        return;
    }

    printf("Append message %s", message->message);

    struct Message *tmp;
    for (tmp=list; tmp!=NULL; tmp = tmp->next) {
        if (tmp->next == NULL) {
            tmp->next = message;
        }
    }
}

int recoveMessage(char *username, char *lastMessage) {

    struct Message *list;

    int i=0;
    int top = inbox->top;
    for (i=0; i< top; i++) {
        if (strcmp(username, inbox->users[i].username) == 0) {
            list = inbox->users[top].messageList;
        }
    }


    if (list == NULL) {
        printf("NULL \n");
        return 0;
    }

    printf("Non NULL %s \n", list->message);

    struct Message *tmp;
    for (tmp=list; tmp->next!=NULL; tmp=tmp->next) {
        printf("Messaggio \n");
        strcat(lastMessage, tmp->sender);
        strcat(lastMessage, " (msg offline) \n");

        strcat(lastMessage, tmp->message);
        //printf(tmp->message);
    }

    return 1;
}

int addUser(char *address, int port, char *username) {

    struct User user;

    strcpy(user.address, address);
    strcpy(user.username, username);
    user.port = port;
    user.online = 1;

    user.port = port;

    int i=0;
    int top = inbox->top;
    for (i=0; i<top; i++) {
        printf("%i -> %s, %s \n", i, user.username, inbox->users[i].username);
        if (strcmp(user.username, inbox->users[i].username) == 0) {
            if (user.address != inbox->users[i].address) {
                strcpy(inbox->users[i].address, user.address);
            }

            if (user.port != inbox->users[i].port) {
                inbox->users[i].port = user.port;
            }

            char message[10000];
            recoveMessage(username, message);
            //printf(message);
            return 1;
        }
    }

    inbox->users[top] = user;
    inbox->top++;

    return 0;
}

int storeMessage(char *username, char *message) {

    int i=0;
    int top = inbox->top;
    for (i=0; i<top; i++) {
        if (strcmp(inbox->users[i].username, username) == 0) {

            struct Message *mess = (struct Message*)malloc(sizeof(struct Message));
            strcpy(mess->sender, username);
            strcpy(mess->message, message);

            appendMessage(inbox->users[i].messageList, mess);
			return 1;
        }
    }
	return 0;
}

int findUser(char *username, char *address, int *port) {

    int i=0;
    int top = inbox->top;
    for (i=0; i<top; i++) {
        if (strcmp(inbox->users[i].username, username) == 0) {
            if (inbox->users[i].online == 1) {
                strcpy(address, inbox->users[i].address);
                *(port) = inbox->users[i].port;
                return  0;
            }else{
                return -1;
            }
        }
    }
    return -2;
}

int disconnectUser(char *address, int port) {
    int i=0;
    int top = inbox->top;
    for (i=0; i<top; i++) {
        if (strcmp(inbox->users[i].address, address) == 0
            && inbox->users[i].port == port) {
            inbox->users[i].online = 0;
            return 0;
        }
    }
    return -1;
}

int removeUser(char *address, char *username) {
    int i=0;
    int top = inbox->top;
    for (i=0; i<top; i++) {
        if (strcmp(inbox->users[i].username, username) == 0) {
	    strcpy(inbox->users[i].username,"");
	    inbox->users[i].port = 0;
	    inbox->users[i].online = 0;
            return 0;
        }
    }
    return -1;

}

void listUsers(char *c) {
    int i=0;
    strcat(c, "Client registrati:\n");
    int top = inbox->top;
    for (i=0; i<top; i++) {
	if(strcmp(inbox->users[i].username,"") != 0){
        	printf("%s:%i %s \n",
		       inbox->users[i].address,
		       inbox->users[i].port,
		       inbox->users[i].username);

			strcat(c, "\t");
		strcat(c, inbox->users[i].username);
		if (inbox->users[i].online == 0) {
		    strcat(c, " (offline) \n");
		}else{
		    strcat(c, " (online) \n");
		}
        }
    }
}
