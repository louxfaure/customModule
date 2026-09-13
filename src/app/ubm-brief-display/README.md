# UbmBriefDisplay

Module de personnalisation de l'affichage des notices (affichage abrégé / Brief Display) dans la liste des résultats.

## 1. Affichage des 2ème & 3ème lignes dans le Brief Display pour les résultats provenant de CDI

Afin de personnaliser et d'améliore l'affichage des résultats locaux selon le type de document, l'alimentation des 2ᵉ et 3ᵉ lignes du Brief Display s'appuie sur des champs locaux. Ainsi la 2e ligne des auteurs est construite à partir des champs 200$f et $gcde la notice, la 3eme ligne affiche la 328 pour les travaux universitaires ou encore les coordonnées pour les cartes géographiques.
Les champs par défaut Auteurs (creator) et Éditeur (publisher) ne sont plus remontés nativement pour CDI. Ce module extrait directement les données depuis les champs PNX locaux pour garantir un affichage fluide et cohérent.

## 2. Badge « Publication / contribution d'un membre de l'Université Bordeaux Montaigne »
Un badge distinctif est affiché dans la liste des résultats pour identifier les publications issues de l'université.
- Condition d'affichage : Présence du champ PNX lds30 contenant la valeur exact publicationUBM.
- Source des données : Ce champ PNX est généré automatiquement lors de l'indexation lorsqu'un champ 970 $a est présent dans la notice bibliographique MARC21.
- Procédure de catalogage : Se référer à la procédure interne de traitement des notices pour les consignes d'ajout du champ 970.