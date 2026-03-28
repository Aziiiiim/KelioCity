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

Le dashboard 3D offre une immersion spatiale dans les locaux de l'entreprise grâce aux fonctionnalités suivantes :

### 🌍 Visualisation et Navigation 3D
* **Immersion Spatiale** : Visualisation 3D complète des locaux, incluant les bureaux, les salles et les employés.
* **Navigation Intuitive** : Déplacement fluide dans l'espace à l'aide de la souris.
* **Optimisation par Zone** : Affichage d'une zone ou d'un étage à la fois pour optimiser le chargement des ressources (assets).
* **Gestion des Étages** : Passage fluide entre les niveaux via un sélecteur dédié ou en cliquant sur les escaliers.
* **Environnement Dynamique** : Fond dégradé interactif se déplaçant avec la caméra pour une expérience visuelle améliorée.

### 🔍 Recherche et Interaction
* **Fiches Descriptives** : Consultation de fiches détaillées lors d'un clic ou d'une recherche, accompagnée d'un zoom automatique sur l'objet concerné.
* **Système de Recherche Avancé** : Barre de recherche permettant de localiser des salles, des employés ou des bureaux sur tous les étages et d'afficher leur fiche.
* **Filtrage Intelligent** : Possibilité de filtrer les résultats par catégorie (Employé, Salle, Bureau).
* **Interactions Objets** :
    * **Illumination** : Les salles et employés s'illuminent au passage de la souris pour une sélection précise.
    * **Portes Animées** : Les portes peuvent être ouvertes ou fermées par un simple clic.

### 👥 Gestion des Employés et Profils
* **Statuts en Temps Réel** : Visualisation de la disponibilité des employés (sur site/télétravail, occupé/absent) via un code couleur spécifique.
* **Espace Personnel** : 
    * Création de comptes avec personnalisation de l'avatar.
    * Choix du bureau lors de l'inscription selon les disponibilités (visualisation via indicateurs vert/rouge).
    * Modification du profil et localisation rapide de son propre emplacement sur l'étage.

### ⚙️ Administration et Évolutivité
* **Interface Admin** : Page dédiée pour l'ajout simplifié de données (salles, employés, étages) via un tableur dans la page admin.
* **Sauvegarde de configurations** : Possibilité de charger ou de télécharger un tableur dans la page admin afin de rétablir ou sauvegarder une configuration d'étages, employés...
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
