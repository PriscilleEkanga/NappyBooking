# 1. Utiliser une image Node légère
FROM node:20-alpine

# 2. Définir le dossier de travail dans le conteneur
WORKDIR /app

# 3. Copier les fichiers de dépendances
COPY package*.json ./

# 4. Installer les dépendances
RUN npm install

# 5. Copier tout le reste du code
COPY . .

# 6. Exposer le port utilisé par Vite (souvent 5173)
EXPOSE 5173

# 7. Lancer l'application en mode développement
CMD ["npm", "run", "dev", "--", "--host"]