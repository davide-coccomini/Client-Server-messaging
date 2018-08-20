
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <string.h>
#include <stdlib.h>

#include "utility.c"

char username[512];

int main(int argc, char const *argv[]) {

	char *clientAddress;
	char *serverAddress;

	int receivePort;
	int sendPort;


	// Prelievo parametri
	if (argc > 4) { 
		clientAddress = (char *) argv[1];
		serverAddress = (char *) argv[3];

		receivePort = atoi(argv[2]);
		sendPort = atoi(argv[4]);
	}else{
		printf("Per avviare il programma ./client <IP locale> <porta locale> <IP server> <porta server>");
		exit(-1);
	}

	// Separazione processo invio con processo ricezione messaggi

	int pid = 0;
	pid = fork();
	if (pid == 0) {
		goto child;
	}

	struct sockaddr_in serv_addr;
	int sock;	

	// Processo in invio
	char command[1024];
	char command1[1024];
	char commandSplitted[1][2048];

		
	if (-1 == (sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP))) { 
		printf("\n Errore durante la creazione del socket \n");
		exit(-1);
	}

	memset(&serv_addr, '0', sizeof(serv_addr));

	serv_addr.sin_family = AF_INET;
	serv_addr.sin_port = htons(sendPort); // converte l'intero in unsigned int 16bit (porte 16k)

	if (inet_pton(AF_INET, serverAddress, &serv_addr.sin_addr) <= 0) {
		printf("\n Indirizzo non valido \n");
		exit(-1);
	}

	if (connect(sock, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0) {
		printf("\n Connessione fallita \n");
		exit(-1);
	}		

	printf("Connessione al server %s", serverAddress);
	printf(" (porta "); printf("%i", sendPort); printf(") effettuata con successo \n");
	printf("Ricezione messaggi istantanei su porta ");
	printf("%i", receivePort); printf("\n");

	while(1) {
		printf("%s>", username);
		fgets(command, sizeof(command), stdin); // Input completo
		normalize(command); // TODO cambiare funzione

		strcpy(command1, command); // TODO unire le variabili
		printf("Hai scritto %s \n", command);

		splitString(command1, commandSplitted, ' ', 0);

		// Comando help
	    if (strcmp(commandSplitted[0], "!help") == 0) {
		menuInfo();
	    }

		// Comando registra su server
	    if (strcmp(commandSplitted[0], "!register") == 0) { // TODO Aggiungere ricezione messaggi offline alla riconnessione
		strcat(command, " ");
		strcat(command, argv[2]);
	        requestServer(sock, command);
	    }

		// Comando who
	    if (strcmp(commandSplitted[0], "!who") == 0) {
	        requestWho(sock, command);
	    }

		// Comando deregistra da server
	    if (strcmp(commandSplitted[0], "!deregister") == 0) {
	        requestDeregister(sock, command);
	    }

		// Comando send
	    if (strcmp(commandSplitted[0], "!send") == 0) {
		strcpy(username, commandSplitted[1]);
	    	requestSend(sock, command);
	    }

		// Comando esci
	    if (strcmp(commandSplitted[0], "!quit") == 0) {
		requestOffline(sock, command);
		close(sock);
	   	break;
	    }

		// Pulizia buffer
		memset(&command, '\0', sizeof(command));
		memset(&command1, '\0', sizeof(command1));
		memset(&commandSplitted[0], '\0', sizeof(commandSplitted[0]));
		memset(&commandSplitted[1], '\0', sizeof(commandSplitted[1]));

	}
	
	close(sock);

child:

	if (pid == 0) {

		// Processo di ricezione
		// Variabili per la ricezione
		struct sockaddr_in si_me;
		int s=0, recv_len;

		char buf[512];
		if ((s=socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == -1) {
			perror("Errore durante l'istanziazione del socket");
		}

		si_me.sin_family = AF_INET;
		si_me.sin_port = receivePort;
		si_me.sin_addr.s_addr = htonl(INADDR_ANY);

		if (-1 == bind(s, (struct sockaddr *) &si_me, sizeof(si_me))) { 
				perror("Errore in fase di binding...");
		}
		
		while (1) {

			if ((recv_len == recv(s, buf, sizeof(buf), 0)) == -1) {
				perror("Errore in invio");
			}

			char message[1][2048];
			splitString(buf, message,':', 2);

			printf("%s \n", buf);
			printf("%s (msg istantaneo) >\n%s", message[0], message[1]);

		}
		close(s);
			
	}
	return 0;
}
