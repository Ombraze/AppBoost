# AppBoost – API Utilisateurs (Express + MySQL)

## Aperçu du projet

Cette application est une petite API REST en **Node.js / TypeScript** avec **Express** et une base de données **MySQL**.  
Elle expose des routes pour gérer des utilisateurs (création, lecture…), avec :
- validation des données (username, email, mot de passe, localisation),
- hashage sécurisé des mots de passe avec **bcrypt**,
- séparation claire entre **routes**, **contrôleurs**, **repositories** (accès DB) et **services** (validation / helpers).

## Structure principale

- `server.ts`  
  - Point d’entrée de l’application.
  - Crée l’instance Express, active `express.json()` et `express.urlencoded()`.
  - Monte le routeur utilisateurs : `app.use(userRouter)`.
  - Lance le serveur sur le port `4000`.

- `routes/users.routes.ts`  
  - Déclare les routes liées aux utilisateurs (par ex. `POST /users`).
  - Délègue la logique métier à `users.controller.ts`.

- `routes/users.controller.ts`  
  - Contient la logique de **contrôleur** pour les utilisateurs.
  - Récupère les données depuis `req.body`.
  - Valide les champs (`username`, `email`, `password`, `localisation`).
  - Utilise **bcrypt** pour hasher le mot de passe.
  - Appelle les fonctions du **repository** (`createUserRecord`, `getUserByUsername`, `getUserByEmail`) pour parler à la base.
  - Gère les codes de retour HTTP (400, 201, 409, 500…).

- `repositories/db.ts`  
  - Configure la connexion MySQL via `mysql2/promise`.
  - Crée un `Pool` partagé (`pool`) en lisant les variables d’environnement :  
    - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

- `repositories/user.repository.ts`  
  - Contient toutes les fonctions d’**accès aux données** pour la table `users` :
    - `createUserRecord(username, email, password, localisation)` : insert un utilisateur et retourne ses infos (sans exposer les détails SQL au contrôleur).
    - `getUserByUsername(username)` : récupère un utilisateur par son `username`.
    - `getUserByEmail(email)` : récupère un utilisateur par son `email`.
    - `getUserById(id)` : récupère un utilisateur par son `id`.
  - Utilise directement `pool.query(...)` pour exécuter les requêtes SQL.

- `src/service.ts`  
  - Regroupe des **fonctions utilitaires / de validation** :
    - `isValidUsername` : autorise seulement lettres, chiffres, `_` et `-`.
    - `hasDigit`, `hasLetter` : vérifient la présence de chiffres / lettres dans le mot de passe.
    - `isValidPassword` : combine les règles sur le mot de passe.
    - `isValidLocalisation` : ne garde que des lettres.
    - `isValidEmail` : vérifie le format de l’email avec une expression régulière.
    - `hashPassword`, `comparePassword` : helpers pour hasher / comparer les mots de passe avec **bcrypt**.

- `utils/.env` (à créer/configurer)  
  - Contient les variables d’environnement pour la base de données, par exemple :
    - `DB_HOST=localhost`
    - `DB_PORT=3306`
    - `DB_USER=root`
    - `DB_PASSWORD=mon_mot_de_passe`
    - `DB_NAME=yboost_j2`

## Lancer le projet

1. **Installer les dépendances**
   ```bash
   cd AppBoost
   npm install
   ```

2. **Configurer l’environnement**
   - Créer un fichier `.env` (ou utiliser `utils/.env` selon ta config) avec les variables DB.
   - Vérifier que la base `yboost_j2` existe et que la table `users` possède les colonnes attendues  
     (`id`, `username`, `email`, `password`, `localisation`, etc.).

3. **Démarrer le serveur en développement**
   ```bash
   npm run dev
   ```
   Le serveur écoute par défaut sur `http://localhost:4000`.

## Flux de création d’utilisateur (résumé)

1. Le client envoie un `POST /users` avec un body JSON :
   ```json
   {
     "username": "john_doe",
     "email": "john@example.com",
     "password": "motdepasseTresLong123",
     "localisation": "Paris"
   }
   ```
2. `users.controller.ts` :
   - Valide les champs.
   - Vérifie que `username` et `email` ne sont pas déjà utilisés via le repository.
   - Hash le mot de passe avec **bcrypt**.
   - Appelle `createUserRecord(...)` du `user.repository`.
3. `user.repository.ts` insère l’utilisateur en base via `pool.query(...)` et renvoie les infos utiles.
4. Le contrôleur retourne une réponse `201` avec les données de l’utilisateur (sans mot de passe en clair).

Ce README te donne une vue d’ensemble rapide : architecture, fichiers importants et manière de lancer l’API.

