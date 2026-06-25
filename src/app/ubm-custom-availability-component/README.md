# Custom UBM Availability Component (Primo VE / NDE)

Ce composant Angular autonome (`standalone`) remplace ou enrichit l'affichage natif des disponibilités physiques (Holdings). 

Il permet d'afficher la dispponibilité des documents dans toutes les bibliothèques apporte une gestion fine des alertes contextuelles (Magasin, Indisponibilité, Réseau) pour inciter les "étudiants à se connecter.

## 🚀 Fonctionnalités principales

* **Alertes Contextuelles Avancées (`isFullDisplay`) :** Affiche des bannières spécifiques en vue détaillée selon l'état du document (ex: inviter à la connexion si le document est en magasin ou indisponible).
* **Affichage des disponiblité :** Rendu harmonisé des données d'exemplaires avec icônes dynamiques, gestion de l'accessibilité (`aria-label`), et intégration des liens de cartographie (*StackMap*).
* **Résilience face aux injections Primo :** Ne dépend pas uniquement des données du cycle de vie de Primo, mais analyse dynamiquement le DOM réel.

---

## 🛠️ Fonctionnement technique et cycle de vie

La principale valeur ajoutée de ce composant réside dans sa capacité à contourner le "figement" des données de l'objet parent (`hostComponent`) injecté par Primo lors de l'utilisation des flèches de navigation.

### 1. Surveillance active de l'URL (`Interval Check`)
Lors du `ngOnInit`, le composant initie un cycle de vérification réactif (toutes les **200ms**). 
* **Pourquoi ?** Primo VE change le contenu de la notice sans détruire/recréer complètement le composant de l'extension. Le routeur classique d'Angular ne détecte pas cette navigation.
* **Action :** Dès qu'une modification de l'URL est interceptée, le composant identifie une navigation latérale.

### 2. Réinitialisation visuelle (`resetState`)
Dès le changement d'URL détecté, la méthode `resetState()` vide immédiatement les variables d'état (`hasMagasin`, `isUnavailable`, etc.) et force un rafraîchissement avec `ChangeDetectorRef.detectChanges()`.
* **Bénéfice :** Évite l'effet "flash" où les informations de la notice précédente restent affichées sur la nouvelle notice (évite les données menteuses à l'écran).

### 3. Analyse hybride du DOM et des Données (`evaluateState`)
Après un léger différé de **150ms** (le temps que Primo injecte le nouveau DOM de la notice), la méthode `evaluateState()` s'exécute et croise deux sources d'informations :
```
┌────────────────────────────────────────┐
         │       Changement d'URL détecté        │
         └───────────────────┬────────────────────┘
                             │
                    [Attente de 150ms]
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │          evaluateState()               │
         └───────────────────┬────────────────────┘
                             │
   ┌─────────────────────────┴─────────────────────────┐
   ▼                                                   ▼
┌──────────────────────────────┐                    ┌──────────────────────────────┐
│  Stratégie 1 : Parsing DOM   │                    │ Stratégie 2 : Données Primo  │
│  (Sécurité & Navigation)     │                    │ (Affinement si disponible)   │
├──────────────────────────────┤                    ├──────────────────────────────┤
│ • Détection de la session    │                    │ • Analyse de physicalAvail-  │
│   (User Area)                │                    │   ability ('unavailable'...) │
│ • Extraction textuelle de    │                    │ • Parsing de l'objet         │
│   l'état (nde-physical-...)  │                    │   docDelivery.holding        │
│ • Recherche de mots-clés :   │                    │ • Vérification de la liste   │
│   "magasin", "indisponible", │                    │   des institutions partenaires│
│   "emprunté", "no inventory" │                    │                              │
└──────────────────────────────┘                    └──────────────────────────────┘
```

### 4. Rendu et Interactions du Template

Une fois l'état évalué, le template HTML réagit dynamiquement :

* **Mode Full Display (Vue détaillée) :** Gère l'affichage des bandeaux d'alertes Material Design (`.ubm-alert`).
* **Mode Liste / Brève :** Génère les lignes de holdings personnalisées. Les clics sur les lignes simulent un clic sur le bouton natif caché de Primo (`button.available-at-button`) pour ouvrir les fenêtres de détails d'une manière totalement transparente pour l'utilisateur.

---

## 🏗️ Structure du Code

* `AVAILABILITY_CONFIG` : Table de correspondance centralisant les couleurs, classes CSS et clés de traduction (ngx-translate) pour chaque état de disponibilité (`available`, `unavailable`, `check_holdings`).
* `triggerLogin()` : Intercepte le clic de l'utilisateur sur l'alerte pour simuler l'ouverture du composant natif de login Primo NDE (`nde-login`).
* `scrollToAndExpandNetwork()` : Fait défiler la page de manière fluide jusqu'au réseau d'institutions (`getit_other`) et déploie le panneau d'expansion Material s'il est replié.

## 🧹 Libération des ressources
Au moment du `ngOnDestroy`, l'intervalle de surveillance (`setInterval`) est proprement effacé pour éviter toute fuite de mémoire (*memory leak*) sur l'application Primo.