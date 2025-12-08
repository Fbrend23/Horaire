import { Module } from './Module.js'

// Définition du planning hebdomadaire
export const weeklySchedule = [
  // Lundi
  new Module('P_Bulle', 'B13', 1, 8, 0, 11, 25),
  new Module('Projet 183', 'A21', 1, 12, 20, 14, 45),
  new Module('Séance de classe', 'A21', 1, 15, 0, 15, 45),
  // Mardi
  new Module('I426', 'B22', 2, 8, 0, 11, 25),
  new Module('C294', 'A01', 2, 13, 10, 16, 35),
  // Mercredi
  new Module('C294', 'A01', 3, 8, 0, 12, 15),
  new Module('Projet 324', 'A11', 3, 13, 10, 15, 45),
  // Jeudi
  new Module('I183', 'A21', 4, 8, 0, 12, 15),
  new Module('I165', 'B11', 4, 13, 10, 16, 35),
  // Vendredi
  new Module('I324', 'A11', 5, 8, 0, 12, 15),
  new Module('P_Prod', 'A01', 5, 13, 10, 15, 45),
]

export function getTodaysModules() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  return weeklySchedule.filter((mod) => mod.dayOfWeek === dayOfWeek)
}

// Fonction utilitaire pour le prochain cours
export function getNextModule(now = new Date()) {
  let nextModule = null
  let minDiff = Infinity

  weeklySchedule.forEach((mod) => {
    const dayDiff = (mod.dayOfWeek - now.getDay() + 7) % 7
    if (dayDiff === 0) {
      const start = mod.getStartDate(now)
      if (start > now) {
        if (start - now < minDiff) {
          minDiff = start - now
          nextModule = mod
        }
      }
    } else {
      // Jours suivants
    }
  })
  return nextModule
}
