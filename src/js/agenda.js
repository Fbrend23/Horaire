// =================================================================================
// Agenda Hebdomadaire
// ---------------------------------------------------------------------------------
// Ce module exporte un tableau contenant l'ensemble des modules programmés pour
// la semaine. Chaque module est défini par une instance de la classe Module,
// qui précise le jour de la semaine ainsi que les horaires.
// ---------------------------------------------------------------------------------
// Exemple :
//   - Pour le lundi (dayOfWeek = 1)
//   - Pour le mardi (dayOfWeek = 2) etc...
// =================================================================================

import { Module } from './cours.js';

export const weeklySchedule = [
  // --------------------------
  // Modules du lundi (dayOfWeek = 1)
  // --------------------------
  new Module("C106", "A02", 1, 8, 0, 8, 45),
  new Module("C106", "A02", 1, 8, 50, 9, 35),
  new Module("C106", "A02", 1, 9, 50, 10, 35),
  new Module("C106", "A02", 1, 10, 40, 11, 25),
  new Module("Séance de classe", "A02", 1, 11, 30, 12, 15),

  new Module("I122", "A02", 1, 13, 10, 13, 55),
  new Module("I122 ", "A02", 1, 14, 0, 14, 45),
  new Module("I122 ", "A02", 1, 15, 0, 15, 45),

  // --------------------------
  // Modules du mardi (dayOfWeek = 2)
  // --------------------------
  new Module("I322", "B11", 1, 8, 0, 8, 45),
  new Module("I322", "B11", 1, 8, 50, 9, 35),
  new Module("I322", "B11", 1, 9, 50, 10, 35),
  new Module("I322", "B11", 1, 10, 40, 11, 25),
  // Vous pouvez ajouter d'autres modules pour les autres jours de la semaine.
];
