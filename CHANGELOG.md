# Notes de Version : Horaire 2.0 (Migration Vue & Mise à Jour Sunset)

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
