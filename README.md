# KelioCity

Ce dépôt contient notre travail sur le projet **KelioCity**, projet visant à modéliser l'espace de travail d'une entreprise et d'intéragir avec les éléments qui apparaissent.

Ce projet se fait dans le cadre de l'UE PROCOM à l'**IMT Atlantique** en collaboration avec l'entreprise **Kelio**. 

### Contenu

Ce dépôt regroupe :

- Un **frontend** en JavaScript (Three.js + Vite)
- Un **backend** en **Spring Boot**
- Une **base de données MySQL**
- Un regroupement de ces 3 éléments via **Docker Compose**

## Installation et lancement

### Cloner le dépot

- https:
```bash
git clone https://github.com/Aziiiiim/KelioCity.git
```

- ssh:
```bash
git clone git@github.com:Aziiiiim/KelioCity.git
```

## Prérequis
- **Docker** installé  
- **Docker Compose** installé (ou Docker Desktop)

Aucune autre installation n'est nécessaire.

### Lancer le projet
```bash
docker compose up
```
Attendre que les 3 services se lancent:
- MySQL
- Backend SpringBoot
- Frontend Three.js

Puis, le projet sera accessible à l'adresse : <http://localhost:5173> (adresse du frontend)

Les API du backend sont accessible avec la base <http://localhost:8080>.
Le port exposé pour la base de donnée est 3307 .

---

### Architecture Docker

Voici ce que met en place le **docker-compose.yml** :

- service mySQL:
  - utilise l'image **mysql** 
  - héberge la base de donnée
  - données persistentes dans un volume Docker local (mysql_data)
  - le backend peut y accéder via mysql:3306
    
- Backend (Spring Boot):
  - Utilise l'image **eclipse-temurin:17-jdk**
  - Recompilation automatique si le code est modifié (!! si DataInitializer est modifié, il faut relancer tous les services !!)
  - Exposé sur <http://localhost:8080>
  - Se connecte à la DB automatiquement

- Frontend (Three.js + Vite):
  - Utilise l'image **node:20**
  - Installe automatiquement les dépendances via **npm**
  - Lance le serveur Vite en mode dev
  - Recompilation automatique si le code est modifié

---

## Déploiement
---

## Fonctionnalités

---

## Démo

---

## Auteurs

- Azim BARHOUMI (azim.barhoumi@imt-atlantique.net)
- Maureen LEPRINCE (maureen.leprince@imt-atlantique.net)
- Arthur LOIZEAU (arthur.loizeau@imt-atlantique.net)

---

## Superviseurs

- Mederic GILLET (mederic.gillet@kelio.com)
- David MARTIN (david.martin@kelio.com)
- Thomas LEDOUX (Thomas.Ledoux@imt-atlantique.fr)
