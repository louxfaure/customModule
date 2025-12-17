# Utiliser une image de base Node.js LTS (Long Term Support)
FROM node:20 

# Définir le répertoire de travail par défaut pour votre conteneur
WORKDIR /app

# Installer Angular CLI globalement pour pouvoir utiliser la commande 'ng'
# La commande 'npm install' pour les dépendances du projet sera faite par la suite
RUN npm install -g @angular/cli

# Exposer le port de développement Angular (4200 ou 4201 si vous utilisez le proxy)
EXPOSE 4201

# Commande par défaut à exécuter (laisse le conteneur actif)
CMD ["tail", "-f", "/dev/null"]