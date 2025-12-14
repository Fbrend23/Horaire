# Notes de Version : Horaire 2.4 (Game Balance & Polish)

## Version 2.4.1 - Hotfix Météo

Correctif rapide pour résoudre un problème avec l'activation de la météo.

### Corrections de Bugs

- **Toggle Météo** : Correction d'un bug où l'activation de la météo ne relançait pas les effets si le site était chargé avec l'option désactivée.
- **Visibilité des Étoiles** : Les étoiles restent désormais visibles même si la météo est désactivée (car elles font partie de l'arrière-plan).

---

## Version 2.4.0 - L'Équilibre Parfait

Une mise à jour massive dédiée à l'équilibrage du jeu, au polissage visuel et à l'ajout de contenu endgame.

### Grand Rééquilibrage (Game Balancing)

Le système économique du Beer Clicker a été entièrement revu pour une progression plus juste et stratégique :

- **Démarrage en Douceur** : Le coût des premiers bonus (Théo, Startup) a été considérablement réduit (100 -> 15) pour aider les nouveaux joueurs.
- **Nouvelles Limites Stratégiques** : Introduction de la limite `MaxPurchases` pour empêcher les abus :
  - **Robot Cliqueur** : Limité à 10 unités.
  - **Auto-Clicker** : Vitesse maximale limitée à 10 améliorations.
  - **Galaxie de Bière** : Limitée à 5 (pour préserver l'univers).
- **Refonte des Robots** : Les "Robots Cliqueurs" ne donnent plus +1 clic fixe, mais **10% de votre puissance de clic actuelle** par robot. Ils évoluent désormais avec vous !
- **Ajustement des Prix** : Les coûts des bâtiments avancés (IA, Quantique) ont été lissés pour une courbe exponentielle plus naturelle.

### Beer Clicker Polish

- **Zéro Clignotement** : Réécriture complète du moteur d'animation (passage à l'API Web Animations) pour éliminer définitivement les "glitchs" et clignotements lors des clics rapides.
- **Animations "Juicy"** : L'animation de "Pop" réagit désormais aux clics automatiques pour un rendu visuel rythmé et satisfaisant.
- **Feedback Passif** : De petites bulles apparaissent passivement pour indiquer que votre brasserie tourne, même sans cliquer.
- **Correctif 0 BPS** : L'affichage de la production gère maintenant les décimales (ex: "0.3 bières/sec") au lieu d'afficher "0".
- **Anti-Ghost** : L'image de la bière n'est plus "draggable", évitant les fantômes visuels lors des clics frénétiques.

### Accessoires (Nouveau)

Le Beer Clicker passe au niveau supérieur avec un tout nouveau système de personnalisation !

- **Système Multi-Slots** : Équipez plusieurs accessoires simultanément (Yeux, Tête, Visage, Cou).
- **Catalogue de lancement** :
  - **Lunettes de Soleil** (Deal with it)
  - **Chapeau de Fête** (Intégré à la mousse)
  - **Couronne Royale** (Pour les rois du clic)
  - **Moustache** (Le chic absolu)
  - **Nœud Papillon** (Élégance garantie)
- **Persistance** : Vos accessoires équipés sont sauvegardés automatiquement.

### Gameplay & Contenu

- **Click Storm** : Ajout d'un bouton d'achat rapide dans l'interface principale pour déclencher la tempête de clics.
- **Nouveaux Skins Premium** : 5 nouvelles apparences en haute définition (Émeraude, Saphir, Obsidienne, Or, Arc-en-ciel).
- **Succès** : Ajout de 13 nouveaux succès à débloquer pour guider votre progression jusqu'au milliard.

### UI & Tech

- **Shop Optimisé** : Les boutons affichent désormais "MAX" et se grisent lorsque la limite d'achat est atteinte.
- **Affichage BPS** : Ajout de la production par seconde directement dans l'en-tête du magasin.
- **Affichage du jour** : Ajout de l'affichage du jour actuel dans l'en-tête.
- **Widget Météo** : Ajout de l'affichage textuel des conditions et de la température dans l'en-tête pour une information immédiate.
- **GitHub** : Ajout d'un bouton flottant pour accéder directement au code source du projet.
- **Navigation** : Le bouton Paramètres est désormais accessible en permanence, même sur la vue Hebdomadaire.
- **Headers Fixes** : Les en-têtes des fenêtres Boutiques et Succès restent désormais visibles lors du défilement, comme pour le Shop principal.
- **Layout Immersif** : Le Beer Clicker adopte une disposition asymétrique (30%/50%/20%) avec un centrage visuel parfait pour mettre la bière en valeur.

### Optimisation Mobile & Layout

- **Mobile** : Optimisation majeure du moteur de particules pour les écrans mobiles haute résolution.
  - **Météo Allégée** : Réduction intelligente du nombre de couches de brouillard (30 -> 5) et de particules (Pluie/Neige) sur mobile pour supprimer tout lag sans sacrifier l'ambiance.
  - **Détection Dynamique** : Le site détecte désormais la puissance et la taille de l'appareil pour ajuster les effets en temps réel.
- **Header Compact** : L'en-tête a été repensé pour les petits écrans :
  - **Titre Masqué** : Le titre "Bienvenue jeune impatient" se cache sur mobile pour laisser respirer l'interface.
  - **Espacements Réduits** : Marges et padding ajustés.
  - **Bouton GitHub** : Le bouton GitHub flottant est maintenant parfaitement aligné et dimensionné comme le bouton de Contact.
- **Espacement Modules** : Réduction des écarts verticaux entre les éléments de l'Agenda et des Vacances sur mobile pour minimiser le défilement.

---

# Notes de Version : Horaire 2.3 (Atmosphère & Performance)

## Version 2.3.0 - Atmosphère & Performance

Une mise à jour majeure centrée sur l'immersion visuelle et la performance technique.

### Météo & Immersion

- **Météo Suisse** : Connexion API ultra-précise (Lausanne Vennes) via le modèle icon_ch.
- **Cycle Jour/Nuit** : L'arrière-plan change de couleur dynamiquement selon l'heure (Aube, Jour, Crépuscule, Nuit).
- **Effets Visuels** :
  - **Brouillard Volumétrique** : Ajoute de la profondeur et du mystère.
  - **Météo Complète** : Pluie, Neige, et Rayons de soleil se superposent à l'ambiance.
  - **Transitions** : Changements d'états fluides et apaisants.
- **Paramètres** : Options dédiées pour désactiver les effets ou la météo complète.

### Transport & Performance

- **Cache Local** : Les données de transport sont mises en cache pour un chargement instantané et moins d'appels API.
- **Compte à Rebours** : Gestion locale du temps restant pour une fluidité parfaite.

### Codebase

- **Nettoyage** : Code nettoyé de ses commentaires de développement pour une maintenance facilitée.

---

# Notes de Version : Horaire 2.2 (Beer Clicker Reforged)

## Version 2.2.2 - UI Polish & Precision

Une mise à jour de confort pour affiner l'interface et la logique de progression.

### Progression de la Journée

- **Titre Explicite** : Ajout du texte "Progression de ta journée" centré au-dessus de la barre.
- **Précision** : Le calcul commence désormais à l'heure exacte du **premier cours** de la journée (au lieu de 7h45 fixe), pour une barre qui colle à la réalité.
- **Week-end Relax** : La barre s'affiche désormais à **100%** durant les weekends et jours libres (car la meilleure journée est celle qui est finie).

### Interface & En-tête

- **Titre Unifié** : "Bienvenue jeune impatient" déménage dans l'en-tête (Header) pour libérer de l'espace.
- **Centrage Absolu** : Le titre est mathématiquement centré dans le header.
- **Espacements** : Réduction des marges inutiles pour un rendu plus compact sur mobile et desktop.

---

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
