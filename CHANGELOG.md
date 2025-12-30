# 2.6.2 - Correctif Progression

- **Barre de Progression** : La barre de "Progression de ta journée" est désormais correctement désactivée (100%) pendant les périodes de vacances.

---

# 2.6.1 - Correctif Vacances

Petit correctif pour assurer la tranquillité pendant les vacances.

- **Cours Actuel** : Correction d'un bug où le module restait actif même pendant les périodes de vacances. Il affiche désormais "Aucun cours" correctement.
- **Module Pause** : Affiche désormais explicitement "Vacances" au lieu de chercher la prochaine pause scolaire.
- **Logique Interne** : Optimisation des vérifications de calendrier pour ignorer les modules hebdomadaires lors des congés.

---

# 2.6.0 - Prestige, Compagnons & Stratégie

Cette mise à jour introduit des objets de luxe pour les joueurs les plus fortunés et ajoute de la vie dans l'en-tête !

## Interface Boutique (QoL)

- **Feuille de Route** : Les objets verrouillés restent visibles mais grisés, affichant clairement leur condition de déblocage (ex: "Requiert 30 Brasseries").
- **Indicateur de Niveau** : Un badge "Nv. X" apparaît sur les bâtiments (Auto) tous les 10 achats, permettant de suivre vos paliers de production d'un coup d'œil.
- **Clarté Maximale** : Une fois un objet acheté au maximum, son prix disparaît pour laisser place à la mention "Complet", épurant ainsi l'interface.

## Virtual Pets (Nouveau)

Des petits compagnons pixel art se promènent désormais librement dans le header de l'application :

- **Compagnons Autonomes** : Un chien et un oiseau qui vivent leur vie (marchent, volent, font des pauses) pendant que vous consultez votre horaire.
- **Animations Détaillées** :
  - **Oiseau** : Animation de vol fluide (4 frames) grâce à un sprite sheet personnalisé.
  - **Chien** : Possède une vraie vie ! Il court parfois (Zoomies), s'assied pour observer, ou s'allonge pour faire une sieste prolongée.
  - **Comportement IA** : Ils explorent l'écran, changent de direction aux bords et ont chacun leur propre personnalité de mouvement.
- **Discret & Mignon** : Ils restent en arrière-plan (pointer-events-none) pour ne jamais gêner la navigation.

## Beerclicker

### Nouveaux Objets de Luxe (Money Sinks)

Pour les milliardaires qui ne savent plus quoi faire de leur bière :

- **5 Nouveaux Skins de Prestige** :
  - **Diamant** (1 Billion) : Brillez de mille feux.
  - **Glitch** (10 Billion) : L'univers buggé.
  - **Le Néant** (100 Billion) : Une bière cosmique qui absorbe la lumière.
  - **Antimatière** (1 Billiard) : Instable et dangereuse.
  - **Divin** (10 Billiard) : Une bière bénie par les dieux.
- **7 Nouveaux Accessoires** :
  - **Monocle** (5 M) : La classe à l'anglaise.
  - **Pipe en Bois** (10 M) : Élémentaire.
  - **Cache-œil** (25 M) : À l'abordage !
  - **Médaille en Or** (50 M) : Pour le champion du clic.
  - **Casque Viking** (250 M) : Skål !
  - **Auréole** (1 Billion) : Sainte protection.
  - **Casque VR** (5 Billion) : Bienvenue dans le métavers.

### Améliorations Diverses

- **Interface Boutique Skins** : Ajout de descriptions pour chaque skin et formatage lisible des prix.
- **Clarté Shop** : Les descriptions affichent désormais la production formatée et concise (ex: "1 Million b/s") pour une lecture immédiate.
- **Gestion des Investissements** : Affichage du total de production généré par chaque type de bâtiment (ex: "Total : 150 b/s") directement sous sa description, pour mieux suivre vos revenus.
- **Terminologie Précise** : Remplacement de "Multiplicateur" par "Puissance du Clic" pour refléter la valeur réelle (base + synergies) rapportée par chaque clic.
- **Ergonomie** : Les boutons d'achat/équipement sont désormais alignés uniformément en bas des cartes.

## Rééquilibrage Stratégique (Nouveau)

- **Déblocage Échelonné** : Les améliorations bonus (Bras Mécaniques, Soirée Pizza, etc.) ne sont plus disponibles immédiatement. Elles nécessitent de posséder un certain nombre de bâtiments liés.
  - _Règle_ : Niveau 1 requiert 10 bâtiments, Niveau 2 requiert 20, etc. (Palier de 10).
- **Buffs Massifs (x2)** : Pour compenser cette difficulté accrue, l'efficacité de TOUS les bonus a été doublée !
  - Les bonus de production (Bras, Pizza, Lubrifiant) passent de +50% à **x2 (Double)**.
  - La Galaxie de Bière multiplie désormais la production mondiale par **3** (au lieu de 2).
  - L'Expansion Mondiale offre +50% (au lieu de +25%).

---

# 2.5.1 - Théorisation & Transparence

Cette mise à jour corrige les incohérences textuelles du Beer Clicker et rééquilibre l'unité emblématique "Clone de Théo".

### Transparence Totale (Dynamic Descriptions)

- **Vrais Chiffres** : Les descriptions du Shop ne mentent plus ! Elles affichent désormais la production **réelle** que vous gagnerez, en prenant en compte tous vos multiplicateurs actuels.
  - _Exemple_ : Si vous avez un bonus global x2, le "Brasseur IA" affichera "10 000 bières/sec" au lieu de 5 000.
- **Correction des Valeurs** : Certaines unités affichaient des valeurs incorrectes (ex: IA affichait 1k, donnait 5k). Le texte est maintenant directement lié au code du jeu pour une précision absolue.

### Rééquilibrage "Clone de Théo"

Le début de partie a été assoupli pour rendre la stratégie "Théo" viable :

- **Clone de Théo** : Production doublée (0.5 -> **1 bière/sec**).
- **Paquet de Clopes** :
  - Coût drastiquement réduit (**6 000 -> 750**).
  - Effet boosté (**+10% -> +25%**).
- **Soirée Clones** :
  - Coût réduit (**25 000 -> 10 000**).
  - **Correctif d'Exploit** : Limité désormais à **1 achat maximum** pour empêcher la boucle infinie de rentabilité.

### Auto-Clicker 2.0

Le mode "Idle" était trop lent. Il a été accéléré :

- **Vitesse de Base** : Triplée (1 clic/3s -> **1 clic/1s**).
- **Potentiel Maximum** : Avec les améliorations, l'Auto-Clicker peut désormais atteindre une vitesse de croisière de ~5 clics/sec (contre ~1 clic/sec auparavant).

### Réformes Structurelles (Usines & Clics)

Des aberrations économiques ont été corrigées :

- **Brasseries (Factories)** : La production de base a été augmentée (25 -> **60** bières/sec) pour qu'elles ne soient plus mathématiquement inférieures aux Startups.
- **Logique des Clics** :
  - **Levure Magique** : Devenue un objet de milieu de partie abordable. Coût divisé par 10 (50k -> **5k**), Effet renforcé (+3 -> **+5**).
  - **Verre en Or** : Repositionné comme un objet de prestige de fin de jeu. Coût x50 (10k -> **500k**), Effet x5 (+10 -> **+50**).

### Synergies & Fin de Partie

- **Synergie Tech** : Coût réduit (75k -> **15k**) et Effet quintuplé (+1% -> **+5%** par Usine). Ce n'est plus un piège financier mais une vraie stratégie !
- **Expansion Mondiale** : Repoussée pour lisser la courbe de progression (250k -> **500k**), mais rendue plus puissante (**+25%** production globale).

### Amélioration Continue

- **Multiplicateur (+1 Clic)** : La courbe de prix était trop punitive. Le facteur d'augmentation du coût a été adouci (x1.4 -> **x1.2**) pour que l'amélioration reste utile plus longtemps.

---

# 2.5.0 - Immersion Vacancière

Cette mise à jour enrichit l'expérience visuelle du module Vacances avec des thèmes dynamiques et une refonte des horloges mondiales, tout en ajoutant des petites touches esthétiques aux modules.

### Nouveautés (Pause & UI)

- **Watermark "Pause"** : Une illustration "Coffee & Croissant" s'invite dans le module de pause.
- **Nouveaux Watermarks** : Un "Cocktail" pour le Week-end, un "Diplôme" pour la fin d'année, une "Animation de Code" pour le cours actuel, et un "Spinner de chargement" pour le suivant.
- **Code Couleur Cours** : Les cartes "Cours actuel" et "Prochain cours" s'adaptent désormais au type de module (Bleu 🔵 pour les cours, Vert 🟢 pour les projets).
- **Animation M2** : Une rame de métro traverse désormais le panneau Transport.

### Thèmes de Vacances Dynamiques

Le compte à rebours des vacances s'anime désormais selon la saison ou la fête à venir :

- **Noël & Hiver** : Une douce chute de neige ❄️ accompagne l'attente des fêtes.
- **Pâques** : Des fleurs de cerisier (Sakura) 🌸 tombent délicatement pour célébrer le printemps.
- **Été** : Un soleil rayonnant ☀️ tourne en arrière-plan pour réchauffer l'atmosphère.
- **Automne** : Des feuilles d'érable 🍁 virevoltent pour marquer la saison.

### Horloges Mondiales Thématiques

Les horloges de New York, Lausanne et Tokyo ont reçu une identité visuelle propre :

- **Cartes Uniques** : Chaque ville dispose de son propre design avec un dégradé de couleurs spécifique.
- **Watermarks Intégrés** :
  - **New York** : La Statue de la Liberté veille en arrière-plan.
  - **Lausanne** : Les montagnes suisses ancrent l'horloge locale.
  - **Tokyo** : Une branche de cerisier en fleurs s'invite depuis le coin de la carte.
- **Immersion** : Les images sont subtilement intégrées en "watermark" avec des effets de transparence et de mélange pour un rendu premium.

---

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
