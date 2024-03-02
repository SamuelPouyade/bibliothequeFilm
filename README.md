# Bibliothèque de Films

## A propos du projet

Ce projet est une application web qui permet de gérer une bibliothèque de films. 
Elle permet de consulter, ajouter, modifier et supprimer des films. 
En plus, chaque utilisateur peut consulter la liste des films disponibles et en ajouter à sa liste de films favoris.
Toute cette gestion se fait via swagger.

Pour gérer cette bibliothèque, les utilisateurs peuvent avoir le choix entre deux rôles :
- `ADMIN` : qui a le droit de consulter, ajouter, modifier et supprimer des films. Il peut aussi gérer les profils de tous les utilisateurs. Il peut aussi envoyer des mails d'informations à l'ensemble des utilisateurs.
- `USER` : qui a le droit de consulter des films. En plus, il peut ajouter des films à sa liste de films favoris.

## Technologies utilisées

- `JAVASCRIPT`
- `NODEJS`
- `SWAGGER`
- `MYSQL` 


## Prérequis

Afin de pouvoir utiliser au mieux l'application vous devrez faire les installations suivantes :

- `NODEJS` : https://nodejs.org/en/download/
- `GIT` : https://git-scm.com/downloads
- `DOCKER` : https://www.docker.com/products/docker-desktop/

Il vous faudra aussi créer un compte (gratuit) sur le site suivant : https://ethereal.email/ afin de recevoir les différents mails.

## Installation

Il faut tout d'abord récupérer le projet en clonant le dépôt git :

```bash 
git clone https://github.com/SamuelPouyade/bibliothequeFilm.git
```
Une fois le projet récupéré, il vous faudra vous rendre à la racine du projet et exécuter la commande suivante pour installer les différentes dépendances :

```bash
npm install
```

Puis lancer la commande suivante pour la base de données :

```bash
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8
```

Pour ensuite lancer toutes les migrations :

```bash
knex migrate:latest
```


Il vous faudra faire pareil dans le sous-dossier `emailService` :

```bash
npm install
```

## Configuration

Pour configurer l'application, il vous faudra créer un fichier `.env` à la racine du projet.

Ce fichier devra contenir les informations suivantes :

```bash
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=

JWT_SECRET=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

Il faudra aussi mettre dans le dossier `emailService` un fichier `.env` avec les informations suivantes :

```bash
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

## Exécution

Il vous suffira d'ouvrir deux terminaux : 

- Le premier devra se trouver à la racine du projet
- Le second devra se trouver dans le sous-dossier `emailService`

Dans le premier terminal, afin de lancer l'application vous devrez écrire dans le terminal la commande suivante :

```bash
npm start
```

Dans le second terminal, afin de lancer le service d'envoi de mail vous devrez écrire dans le terminal la commande suivante :

```bash
docker run -d -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```
A noter que la commande -d permet de lancer le conteneur en arrière-plan. 
Le lancer en arrière plan permet de pouvoir se servir du terminal pour autre chose. 
Après avoir exécuté la première commande vous devrez exécuter la commande suivante :

```bash
npm start
```


## Utilisation

Pour utiliser l'application, une fois les commandes précédentes lancées vous devrez vous rendre à l'adresse suivante:

```bash
http://localhost:3000/documentation
```

Le port pourra être différent, il doit être égale à celui précisé dans le fichier .env à la racine du projet.

Pour consulter les mails vous devrez vous rendre sur le site suivant : 

```bash
https://ethereal.email/messages
```

Une fois cela fait amusez-vous en gérant la bibliothèque de film !