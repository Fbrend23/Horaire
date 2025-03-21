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
  new Module("I122", "A02", 1, 14, 0, 14, 45),
  new Module("I122", "A02", 1, 15, 0, 15, 45),

  // --------------------------
  // Modules du mardi (dayOfWeek = 2)
  // --------------------------
  new Module("I322", "B11", 1, 8, 0, 8, 45),
  new Module("I322", "B11", 1, 8, 50, 9, 35),
  new Module("I322", "B11", 1, 9, 50, 10, 35),
  new Module("I322", "B11", 1, 10, 40, 11, 25),

  new Module("I122", "A11", 1, 13, 10, 13, 55),
  new Module("I122", "A11", 1, 14, 0, 14, 45),
  new Module("I122", "A11", 1, 15, 0, 15, 45),
  new Module("I122", "A11", 1, 15, 50, 16, 35),
  
// --------------------------
// Modules du mercredi (dayOfWeek = 3)
// --------------------------
new Module("Sport", "Dojo", 1, 9, 50, 10, 35),
new Module("Sport", "Dojo", 1, 10, 40, 11, 25),

new Module("P_Prod", "N509", 1, 12, 20, 13, 5),
new Module("P_Prod", "N509", 1, 13, 10, 13, 55),
new Module("P_Prod", "N509", 1, 14, 0, 14, 45),
new Module("P_Prod", "N509", 1, 15, 0, 15, 45),

// --------------------------
// Modules du jeudi (dayOfWeek = 4)
// --------------------------
new Module("I254", "A21", 1, 8, 0, 8, 45),
new Module("I254", "A21", 1, 8, 50, 9, 35),
new Module("I254", "A21", 1, 9, 50, 10, 35),
new Module("I254", "A21", 1, 10, 40, 11, 25),

new Module("I322", "B11", 1, 12, 20, 13, 5),
new Module("I322", "B11", 1, 13, 10, 13, 55),
new Module("I322", "B11", 1, 14, 0, 14, 45),
new Module("I322", "B11", 1, 15, 0, 15, 45),

// --------------------------
// Modules du Vendredi (dayOfWeek = 5)
// --------------------------
new Module("C107", "A02", 1, 8, 0, 8, 45),
new Module("C107", "A02", 1, 8, 50, 9, 35),
new Module("C107", "A02", 1, 9, 50, 10, 35),
new Module("C107", "A02", 1, 10, 40, 11, 25),
new Module("C107", "A02", 1, 11, 30, 12, 15),

new Module("I254", "A21", 1, 13, 10, 13, 55),
new Module("I254", "A21", 1, 14, 0, 14, 45),
new Module("I254", "A21", 1, 15, 0, 15, 45),
new Module("I254", "A21", 1, 15, 50, 16, 35),
];
