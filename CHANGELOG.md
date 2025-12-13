# Notes de Version : Horaire 2.2 (Beer Clicker Reforged)

## Version 2.2.1 - Hotfix Layout & Dashboard

Correctif rapide pour ajuster la grille du tableau de bord et le comportement du Beer Clicker.

### Layout Dashboard 30-40-30

- **Grille Proportionnelle** : Passage à une répartition 30% / 40% / 30% pour un centrage mathématique.
  - **Agenda (Centre)** : 40% (Module dominant).
  - **Beer Clicker & Vacances (Côtés)** : 30% chacun.
- **Responsive** : Les colonnes s'adaptent (320px sur laptop, 420px sur desktop large) pour éviter le décalage.
- **Expansion** : Les modules s'adaptent intelligemment à la largeur disponible.

---

## Version 2.2.0 - Mise à Jour "Beer Clicker Reforged"

Une refonte majeure du module Beer Clicker pour une meilleure expérience visuelle et une stabilité à toute épreuve.

### Nouveaux Assets & Visuels

- **Icônes 3D** : Adieu les émojis ! 17 nouvelles icônes 3D haute qualité remplacent les anciens textes pour chaque amélioration.
- **Réactif & Fluide** : Le design s'adapte désormais parfaitement à toutes les tailles d'écran. L'image de la bière grandit et rétrécit dynamiquement pour éviter tout débordement.

### Collection de Skins

Donnez du style à votre bière avec 3 nouvelles apparences à débloquer :

- **Les Classiques** : Blanche, Ambrée, Rubis.
- **Les Légendaires** : Radioactive (brille dans le noir ?) et Cosmique (le goût de l'infini).

### Avalanche de Bonus

Une tonne de nouvelles améliorations pour booster votre empire :

- **Boosters de Production** : Soirée Pizza, Paquet de Clopes, Lubrifiant Industriel et Bras Mécaniques.
- **Synergies** : Synergie Tech et Soirée Clones pour récompenser votre stratégie.
- **Buffs de Clic** : Levure Magique et le prestigieux Verre en Or.
- **Endgame** : Expansion Mondiale et Galaxie de Bière pour des chiffres qui donnent le tournis.

### Mécaniques de Jeu & UX

- **En-tête de Boutique Fixe** : L'en-tête de la boutique reste désormais visible lorsque vous faites défiler la liste des améliorations. Plus besoin de remonter pour voir votre solde !
- **Nouvelles Mécaniques Exotiques** :
  - **Coup de Poing Assisté** : Un bonus puissant pour les cliqueurs acharnés.
- **Reset Flexible** : Vous avez le choix ! Lors de la réinitialisation du jeu, vous pouvez désormais choisir de conserver vos Skins et vos Succès débloqués.
- **Formatage des Nombres** :
  - **Suffixes Complets** : Affichage clair avec "Million", "Milliard", "Trillion", etc. au lieu de simples lettres.
  - **Notation Scientifique** : Support automatique des nombres astronomiques dès que nécessaire (jusqu'au Vigintillion 1e63 et au-delà).
- **Bonus Alignés** : L'affichage des bonus a été réorganisé (alignement vertical, quantités à droite) pour être plus propre et lisible.

### Corrections Techniques & UI

- **Layout Stabilisé** : Correction critique des problèmes de mise en page où la colonne centrale était écrasée par le dashboard.
  - **Colonnes Latérales Fixes** : Taille verrouillée pour éviter le décalage.
- **Boutons Compacts** : Taille des boutons d'action (Auto-Clicker, Reset) réduite pour une interface plus aérée.

---

# Notes de Version : Horaire 2.1 (Transport & Personnalisation)

## Version 2.1.1 - Layout & DevOps

Une mise à jour rapide pour polir l'expérience sur grand écran et automatiser le déploiement.

### Corrections & Améliorations Design

- **Layout Hybride** : Le widget Transport s'affiche désormais comme une ligne complète sur ordinateur, tout en restant compact et ordonné (2ème position) sur mobile.
- **Espacements Affinés** : Réduction majeure des espaces verticaux (`gap-y-2`) pour connecter le widget Transport aux colonnes principales.
- **Contraintes Largeur** : Ajout d'une largeur maximale (`max-w-[1600px]`) pour garder une interface centrée et lisible sur les écrans ultra-larges.

### DevOps & Déploiement

- **GitHub Actions** : Mise en place d'un pipeline de déploiement automatique vers Infomaniak lors de la publication d'une Release.
- **Déploiement Manuel** : Possibilité de déclencher le déploiement manuellement depuis l'interface GitHub.

---

## Version 2.1.0 - Mise à Jour "Metro & Drag"

Cette mise à jour apporte des fonctionnalités pour personnaliser votre expérience et faciliter vos déplacements.

### Nouveau Widget Transport : M2

Ne manquez plus jamais votre métro !

- **Suivi en temps réel** : Un nouveau panneau en bas de page affiche les prochains départs du M2.
- **Direction Double** : Consultez instantanément les départs depuis **Lausanne Gare** (montée vers Vennes) et depuis **Lausanne Vennes** (descente vers Gare).

### Dashboard Modulable

Votre horaire, votre style.

- **Drag & Drop** : Vous pouvez désormais **déplacer les colonnes** (Beer Clicker, Agenda, Vacances) pour les organiser selon vos préférences.
- **Sauvegarde Automatique** : Votre disposition personnalisée est enregistrée et sera là à votre prochain retour.
- **Mode Mobile Intelligent** : Sur mobile, le module "Beer Clicker" se place automatiquement en bas pour laisser la priorité à l'agenda, tout en respectant votre ordre personnalisé sur ordinateur.

### Corrections & Améliorations

- **Header Compact** : La barre de navigation a été affinée pour laisser plus de place au contenu.
- **Vue Alignée** : Correction de l'alignement des colonnes pour un rendu visuel parfait.
- **Météo** : Optimisation de la connexion avec l'API météo pour éviter les erreurs de chargement.

---

# Archives : Horaire 2.0 (Migration Vue & Mise à Jour Sunset)

## Partie technique

**Résumé** : Cette fusion finalise la migration de l'application legacy `Horaire-main` (Vanilla JS) vers une architecture moderne **Vue 3 + Vite**, intégrée avec **Tailwind CSS v4** et **Pinia** pour la gestion d'état.

### Architecture & Stack

- **Framework** : Migration de Vanilla JS/JQuery vers **Vue 3 (Composition API)**.
- **Outil de Build** : Implémentation de **Vite** pour le HMR et des builds optimisés.
- **Gestion d'État** : Introduction de **Pinia** pour un état centralisé (`gameStore`, `settingsStore`).
- **Styles** : Remplacement du CSS personnalisé par **Tailwind CSS v4** + PostCSS.
- **Routing** : Ajout de **Vue Router** (actuellement vue unique, prêt pour l'expansion).

### Refactoring & Base de Code

- **Composants** : Découpage du monolithique `index.html` en composants Vue modulaires :
  - `BeerClicker.vue` : Logique du jeu et interface.
  - `InfoColumn.vue` : Logique d'affichage des horaires et cours.
  - `VacationColumn.vue` : Compte à rebours et horloges mondiales.
  - `TheHeader.vue` & `modals/*.vue` : Navigation et superpositions.
- **Séparation de la Logique** : Extraction de la logique métier dans des composables/modules dédiés :
  - `src/logic/agenda.js` : Parsing de l'emploi du temps et détection des modules.
  - `src/logic/time.js` : Utilitaires de temps.
  - `src/logic/weatherService.js` : Abstraction de l'API météo.
  - `src/logic/vacances.js` : Données des jours fériés.
- **Système de Thème** : Implémentation de thèmes basés sur les variables CSS (`:root` vs `.theme-blue-night`) permettant un changement dynamique sans "prop drilling".

### Améliorations Clés

- **Météo** : Passage au fournisseur **OpenMeteo (modèle MeteoSwiss icon_ch)** pour des données locales de haute précision (Lausanne Vennes).

---

## Notes de Version

**Version 2.0.0 - Mise à Jour "Sunset Horizon"**

Bienvenue dans la toute nouvelle application Horaire ! Nous avons entièrement reconstruit le moteur pour le rendre plus rapide, plus fluide et plus vivant que jamais.

### Nouvelle Expérience "Sunset Horizon"

- **Nouveau Look par Défaut** : Découvrez le nouveau thème "Sunset" avec un fond crépusculaire dynamique et animé qui change de couleur doucement avec le temps.

- **Météo en Direct** : L'arrière-plan réagit à la météo réelle de **Lausanne (Vennes)** !
  - Regardez la pluie tomber lors des averses.
  - Voyez les flocons de neige dériver en hiver.
  - Profitez des "lucioles" dérivantes par temps clair.

### Personnalisation Améliorée

- **Sélecteur de Thème** : Vous préférez le look classique ? Revenez au thème **"Blue Night"** instantanément via le menu Paramètres.
- **Effets Activables** : Contrôle total pour désactiver les animations météo si vous préférez une vue statique.
- **Paramètres Modernisés** : Un panneau de paramètres plus propre et plus facile à utiliser.
- **Bouton Contact** : Redessiné pour flotter élégamment dans le coin.

### Beer Clicker & Modules

- **Refonte Visuelle** : Tous les modules (Beer Clicker, Agenda, Vacances) ont été redessinés avec un style "Glassmorphism" élégant (effet verre dépoli).
- **Infos Plus Claires** : Les horaires de cours et comptes à rebours sont maintenant plus faciles à lire avec une typographie et une mise en page améliorées.
