
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <signal.h>

#include "utility.c"

int main(int argc, char const *argv[]) {

	int receivePort = 0;

	if (argc == 2) {
		receivePort = atoi(argv[1]);
	}else{
		printf("Per avviare il server lanciare ./server <porta-ricezione>");
		exit(-1);
	}

	int ret, sd, new_sd; // identificativo del socket, 
	pid_t pid;

	struct sockaddr_in my_addr, cl_addr;
	char buffer[1024];


	// Istanza socket
	sd = socket(AF_INET, SOCK_STREAM, 0);
	// TODO Controllare se fallisce

	memset(&my_addr, 0, sizeof(my_addr));

	my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(receivePort);
	my_addr.sin_addr.s_addr = INADDR_ANY;

	ret = bind(sd, (struct sockaddr*) &my_addr, sizeof(my_addr)); // Codice identificativo identificativo del socket
	// TODO COntrollare fallimento di bind()

	ret = listen(sd, 10); // QUi c'è la listen perché stiamo usando il TCP e si deve mettere in ascolto continuo

	if (ret < 0) {
		perror("Errore nella listen");
		exit(-1);
	} 

	printf("Binding effettuato su %d\n", receivePort);

	// Inizializzazione struttura dati, utenti e messaggi
	initInbox();

	while(1) {
		socklen_t len = sizeof(struct sockaddr_in); // 
		new_sd = accept(sd, (struct sockaddr*) &cl_addr, &len); // Accetta la connessione in entrata da parte di un client che prova a collegarsi al server
		pid = fork(); // Per ogni connessione faccio la fork così da utilizzare un processo per ogni client

		// Processo figlio che dovrà dedicarsi al singolo client
		if (pid == 0) {
			close(sd); // SI evita che un altro client provi ad avere rapporti con questo processo
			
			// Ciclo continuativo
			while(1) {
				
				ret = recv(new_sd, buffer, 6, 0); // RIcezione della quantità di dati 
				if (ret < 0) {
					perror("Errore in fase di ricezione della quantità");
					close(new_sd);
					break;
				}

				int size = atoi(buffer);
				if (size > atoi(buffer)) {
					size = atoi(buffer);	
				}
				
				memset(&buffer, '\0', size); // Creazione del buffer su cui ricevere i dati
				
				ret = recv(new_sd, buffer, sizeof(buffer), 0); // RIcezione dei dati veri e propri
				if (ret < 0) {
					perror("Errore in fase di ricezione dei dati");
					close(new_sd);
					break;
				}

				// Disconnessione del client in caso di situazioni anomale
				if (strlen(buffer) == 0) { kill(getpid(), SIGKILL); } 

				printf("Ricevuto %s \n", buffer);
				command(buffer, new_sd, &cl_addr);

				// Pulizia buffer
				memset(&buffer, '\0', sizeof(buffer));

			}

			// Uscita solo se termina la connessione
			close(new_sd);
			exit(1);
		}else{
			close(new_sd);
		}
	}

}
