
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <string.h>
#include <stdlib.h>

extern char username[512];

void normalize(char *str) {
    int len = strlen(str);
    str[len-1] = '\0';
}

void splitString(char *str, char tmp[][2048], const char c, int n) {

    int i=0, j=0, cnt=0;
	// Se la i supera la lunghezza della stringha, 
	// n è il numero di parole da frammentare 
    for (i=0; i<=(strlen(str)) && ((n!=0 && cnt<n) || (n==0)); i++) {
		if (str[i] == c && str[i+1] == '\0') {
			tmp[cnt][j] = '\0';
			cnt++;
			j = 0;
		} else if (str[i] == c || str[i] == '\0') {
            tmp[cnt][j] = '\0';
            cnt++;
            j = 0;
        }else{
            tmp[cnt][j] = str[i];
            j++;
        }
    }

}

void menuInfo() {
    printf("\nSono disponibili i seguenti comandi: \n");
    printf("!help --> mostra l\'elenco dei comandi disponibili \n");
    printf("!register username --> registra il client presso il server \n");
    printf("!deregister --> de-registra il client presso il server \n");
    printf("!who mostra l'elenco degli utenti disponibili \n");
    printf("!send username --> invia un messaggio ad un altro utente \n");
    printf("!quit --> disconnette il client dal server ed esce \n");
}

void sendToUser(char *from, char *address, int port) {

	struct sockaddr_in si_other;
	int s, slen = sizeof(si_other);

	if ((s=socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == -1) {
		perror("Errore durante l'istanziazione del socket");
	}

	memset((char *) &si_other, 0, sizeof(si_other));
	si_other.sin_family = AF_INET;
	si_other.sin_port = port;

	if (inet_aton(address, &si_other.sin_addr) == 0) {
		perror("Indirizzo non valido");
	}

	char body[3000];
	char message[2048];
	memset(&message, '\0', 512);

	while (1) {
		fgets(message, sizeof(message), stdin);

		memset(&body, '\0', 3000);
		strcat(body, username);
		strcat(body, ":");
		strcat(body, message);

		if (sendto(s, body, strlen(body), 0, (struct sockaddr *) &si_other, slen) == -1) {
			perror("Errore in invio");
		}

		if (message[0] == '.') break;
	}
	close(s);
}

// Ricezione risposta
void receiveMessage(int sock) {

	char message[1024];

	int ret = recv(sock, message, 6, 0);
	if (ret < 0) {
		perror("Errore in fase di ricezione");
		close(sock);
		return;
	}

	int size = atoi(message);
	if (size > atoi(message)) {
		size = atoi(message);	
	}
				
	memset(&message, '\0', sizeof(message));

    ret = recv(sock, message, sizeof(message), 0); // Ricezione della risposta
    if (ret < 0) {
        perror("Errore in fase di ricezione");
        return;
    }
    printf("%s \n", message);
}

// Invio comando con ricezione risposta
void receiveSendResponse(int sock) {
    char message[1024];
    memset(&message, '\0', sizeof(message));

    int ret = recv(sock, message, sizeof(message), 0);
    if (ret < 0) {
        perror("Errore in fase di ricezione");
        return;
    }

    if (strcmp(message, ":nontrovato") == 0) {
        printf("%s \n", "Utente non trovato");
        return;
    }

    if (strcmp(message, ":offline") == 0) {
		printf("offline\n");
        char command[1024];

		memset(&command, '\0', sizeof(command));
        fgets(command, sizeof(command), stdin);

		printf("Messaggio: %s", command);

        send(sock, command, strlen(command), 0);
    }else{
		printf("online %s\n", message);

		char user[1][2048];
		splitString(message, user, ':', 0);
		
		printf("indirizzo utente: %s %s\n", user[0], user[1]);

		sendToUser("prova", user[0], atoi(user[1]));
    }
}


// Interfaccia comandi
void requestServer(int sock, char *command) {
	char size[6];
	sprintf(size, "%lu", sizeof(command));
	send(sock, size, 6, 0); // ogni comunicazione prima la quantità e poi i dati

    send(sock, command, strlen(command), 0);
    receiveMessage(sock);
}

void requestWho(int sock, char *command) {
	char size[6];
	sprintf(size, "%lu", sizeof(command));
	send(sock, size, 6, 0);

    send(sock, command, strlen(command), 0);
    receiveMessage(sock);
}

void requestSend(int sock, char *command) {
	char size[6];
	sprintf(size, "%lu", sizeof(command));
	send(sock, size, 6, 0);

    send(sock, command, strlen(command), 0);
    receiveSendResponse(sock);
}

void requestDeregister(int sock, char *command) {
	char size[6];
	sprintf(size, "%lu", sizeof(command));
	send(sock, size, 6, 0);

    send(sock, command, strlen(command), 0);
    receiveMessage(sock);
}

void requestOffline(int sock, char *command) {
    send(sock, command, strlen(command), 0);
    close(sock);
}

