#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <string.h>
#include <stdlib.h>

#include "inbox.c"

void splitString(char *str, char tmp[][2048]) {

    int i=0, j=0, cnt=0;
    for (i=0; i<=(strlen(str)); i++) {
		if (str[i] == ' ' && str[i+1] == '\0') {
			tmp[cnt][j] = '\0';
			cnt++;
			j = 0;
		} else if (str[i] == ' ' || str[i] == '\0') {
            tmp[cnt][j] = '\0';
            cnt++;
            j = 0;
        }else{
            tmp[cnt][j] = str[i];
            j++;
        }
    }

}

void sendMessage(int sock, char *message) {
	char size[6];
	
	sprintf(size, "%lu", sizeof(message));
	send(sock, size, 6, 0);

	char m[1024]; strcpy(m, message);
    send(sock, m, strlen(m), 0);
}

void command(char *buffer, int sock, struct sockaddr_in* cl_addr) {

    printf("%s", "Command ");

    char command1[2][2048];
    splitString(buffer, command1);

    char *command = command1[0];

    //printf("%s \n", command1[1]);
    if (strcmp(command, "!register") == 0) {
        printf("REGISTER \n");

        struct sockaddr_in* pV4Addr = cl_addr;
        struct in_addr ipAddr = pV4Addr->sin_addr;
        //int port = ntohs(pV4Addr->sin_port);
		int port = atoi(command1[2]);

        char address[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &ipAddr, address, INET_ADDRSTRLEN);

        printf("%s:%d \n", address, port);

        int result = addUser(address, port, command1[1]);

        if (result == 0) {
            sendMessage(sock, "Registrato correttamente");
        }else{
            char message[10000];
            int hasHistory = recoveMessage(command1[1], message);
            if (hasHistory == 1) {
                sendMessage(sock, message);
            }else{
                sendMessage(sock, "Ok");
            }
        }
    }

    if (strcmp(command, "!who") == 0) {
        printf("WHO \n");

        char c[10000];
	memset(&c, '\0', sizeof(c));
        listUsers(c);
	printf("%s",c);
        sendMessage(sock, c);
	memset(&c, '\0', sizeof(c));
    }

    if (strcmp(command, "!deregister") == 0) {
        printf("DEREGISTER \n");

        struct sockaddr_in* pV4Addr = (struct sockaddr_in*)&sock;
        struct in_addr ipAddr = pV4Addr->sin_addr;

        char address[INET_ADDRSTRLEN];
        inet_ntop( AF_INET, &ipAddr, address, INET_ADDRSTRLEN );

        int result = removeUser(address, command1[1]);

        if (result == 0) {
            sendMessage(sock, "Deregistrazione avvenuta con successo");
        }else{
            sendMessage(sock, "Utente non trovato");
        }
    }

    if (strcmp(command, "!send") == 0) {
        printf("SEND \n");

        char address[1024];
        int port;

        int r = findUser(command1[1], address, &port);
        if (r == 0) {
            char message[1024];
            char ps[5];

            memset(&message, '\0', sizeof(message));
            memset(&ps, '\0', sizeof(ps));

			sprintf(ps, "%d", port);

            strcat(message, address);
            strcat(message, ":");
            strcat(message, ps);

			printf("Send online: %s:%d\n", address, port);

            sendMessage(sock, message);
        }else if (r == -1) {
            char message[1024];
            memset(&message, '\0', sizeof(message));

			sendMessage(sock, ":offline");
            int ret = recv(sock, message, sizeof(message), 0);
			if (ret < 0) {
				perror("Errore in fase di ricezione");
			}
		
			printf("Messaggio da %s: %s", command1[1], message);
            storeMessage(command1[1], message);
			recoveMessage(command1[1], message);
			
        }else if (r == -2) {
            sendMessage(sock, ":nontrovato");
        }
    }

    if (strcmp(command, "!quit") == 0) {
        printf("QUIT \n");

        struct sockaddr_in* pV4Addr = (struct sockaddr_in*)&sock;
        struct in_addr ipAddr = pV4Addr->sin_addr;
        int port = ntohs(pV4Addr->sin_port);

        char address[INET_ADDRSTRLEN];
        inet_ntop( AF_INET, &ipAddr, address, INET_ADDRSTRLEN );

        disconnectUser(address, port);
    }

    memset(&buffer, '\0', sizeof(buffer));

}
