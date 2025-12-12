import { Module } from './module.js'
import { getNow } from './time.js'
import { vacations } from './vacances.js'

// Définition du planning hebdomadaire (0 = dimanche, 1 = lundi, …, 6 = samedi)
export const weeklySchedule = [
  // Modules du lundi (dayOfWeek = 1)
  new Module('P_Bulle', 'B13', 1, 8, 0, 11, 25),
  new Module('Projet 183', 'A21', 1, 12, 20, 14, 45),
  new Module('Séance de classe', 'A21', 1, 15, 0, 15, 45),

  // Modules du mardi (dayOfWeek = 2)
  new Module('I426', 'B22', 2, 8, 0, 11, 25),
  new Module('C294', 'A01', 2, 13, 10, 16, 35),

  // Modules du mercredi (dayOfWeek = 3)
  new Module('C294', 'A01', 3, 8, 0, 12, 15),
  new Module('Projet 324', 'A11', 3, 13, 10, 15, 45),

  // Modules du jeudi (dayOfWeek = 4)
  new Module('I183', 'A21', 4, 8, 0, 12, 15),
  new Module('I165', 'B11', 4, 13, 10, 16, 35),

  // Modules du vendredi (dayOfWeek = 5)
  new Module('I324', 'A11', 5, 8, 0, 12, 15),
  new Module('P_Prod', 'A01', 5, 13, 10, 15, 45),
]

/**
 * Retourne les modules prévus pour aujourd'hui.
 * @returns {Array} Modules du jour courant.
 */
export function getTodaysModules() {
  const today = getNow()
  const dayOfWeek = today.getDay() // 0 = dimanche, 1 = lundi, etc.
  return weeklySchedule.filter((mod) => mod.dayOfWeek === dayOfWeek)
}

/**
 * Retourne le prochain module dont le nom est différent de celui du module en cours.
 * @param {Object} currentModule - Module en cours.
 * @returns {Object|null} Le prochain module différent ou null.
 */
export function getNextDifferentModule(currentModule) {
  const now = getNow()
  let nextModule = null
  let nextOccurrenceTime = Infinity

  for (let mod of weeklySchedule) {
    if (mod.moduleName === currentModule.moduleName) continue
    const occurrence = getNextOccurrence(mod, now)
    const diff = occurrence - now
    if (diff > 0 && diff < nextOccurrenceTime) {
      nextOccurrenceTime = diff
      nextModule = mod
    }
  }
  return nextModule
}

/**
 * Retourne le module dont la prochaine occurrence est la plus proche.
 * @returns {Object|null} Le module le plus proche ou null.
 */
export function getNextModule() {
  const now = getNow()
  let nextModule = null
  let nextOccurrenceTime = Infinity

  for (let mod of weeklySchedule) {
    const occurrence = getNextOccurrence(mod, now)
    const diff = occurrence - now
    if (diff > 0 && diff < nextOccurrenceTime) {
      nextOccurrenceTime = diff
      nextModule = mod
    }
  }
  return nextModule
}

/**
 * Calcule la prochaine occurrence d'un module par rapport à maintenant.
 * @param {Object} mod - Instance de Module.
 * @param {Date} now - Date et heure actuelles.
 * @returns {Date} La date de la prochaine occurrence du module.
 */
export function getNextOccurrence(mod, now) {
  let occurrence = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    mod.startHour,
    mod.startMinute,
    0,
    0,
  )
  const nowDay = now.getDay()
  const targetDay = mod.dayOfWeek

  if (targetDay < nowDay || (targetDay === nowDay && occurrence <= now)) {
    const daysUntil = 7 - nowDay + targetDay
    occurrence.setDate(occurrence.getDate() + daysUntil)
  } else if (targetDay > nowDay) {
    const daysUntil = targetDay - nowDay
    occurrence.setDate(occurrence.getDate() + daysUntil)
  }

  // Si la date de l'occurrence tombe pendant des vacances, on avance d'une semaine jusqu'à être en dehors de la période
  while (isDuringVacation(occurrence)) {
    occurrence.setDate(occurrence.getDate() + 7)
  }
  return occurrence
}

export function isDuringVacation(date) {
  // On parcourt la liste des vacances
  return vacations.some((vac) => {
    return date >= vac.startDate && (vac.endDate ? date <= vac.endDate : true)
  })
}

/**
 * Retourne le dernier module du même bloc (même nom) pour la journée courante.
 * @param {Object} currentModule - Module courant.
 * @param {Date} now - Date de référence.
 * @returns {Object} Le dernier module du bloc.
 */
export function getLastModuleInCurrentBlock(currentModule, now) {
  const dayOfWeek = now.getDay()
  // Récupère et trie les modules du jour par heure de début
  let dailyModules = weeklySchedule
    .filter((m) => m.dayOfWeek === dayOfWeek)
    .sort((a, b) => {
      if (a.startHour === b.startHour) {
        return a.startMinute - b.startMinute
      }
      return a.startHour - b.startHour
    })

  // Recherche l'index du module courant
  let currentIndex = dailyModules.findIndex(
    (m) =>
      m.moduleName === currentModule.moduleName &&
      m.startHour === currentModule.startHour &&
      m.startMinute === currentModule.startMinute,
  )

  if (currentIndex === -1) return currentModule

  let lastIndex = currentIndex
  // Parcourt les modules suivants avec le même nom
  for (let i = currentIndex + 1; i < dailyModules.length; i++) {
    if (dailyModules[i].moduleName === currentModule.moduleName) {
      lastIndex = i
    } else {
      break
    }
  }
  return dailyModules[lastIndex]
}

/**
 * Calcule la date de la prochaine pause.
 * @param {Date} now
 * @returns {Date|null} Date de la prochaine pause
 */
export function getNextPause(now) {
  let nextPause
  const day = now.getDay()

  // Si c'est le weekend, on cible le lundi matin
  if (day === 0 || day === 6) {
    let nextMonday = new Date(now)
    const daysToMonday = day === 6 ? 2 : 1
    nextMonday.setDate(now.getDate() + daysToMonday)
    nextMonday.setHours(9, 35, 0, 0)
    nextPause = nextMonday
  } else {
    // Horaires de pause pour les jours ouvrés
    const pauseTimes = [
      { hour: 9, minute: 35 },
      { hour: 14, minute: 45 },
    ]
    for (let pause of pauseTimes) {
      let candidate = new Date(now)
      candidate.setHours(pause.hour, pause.minute, 0, 0)
      if (candidate > now) {
        nextPause = candidate
        break
      }
    }
  }

  // Si toutes les pauses de la journée sont passées, définir la pause du lendemain matin
  if (!nextPause) {
    let tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(9, 35, 0, 0)
    nextPause = tomorrow
  }

  // Boucle pour exclure les dates qui tombent en vacances ou sur un weekend (au cas où)
  while (isDuringVacation(nextPause) || nextPause.getDay() === 0 || nextPause.getDay() === 6) {
    let next = new Date(nextPause)
    next.setDate(next.getDate() + 1)
    next.setHours(9, 35, 0, 0)
    nextPause = next
  }
  return nextPause
}

export function getCurrentModule(now) {
  const todaysModules = getTodaysModules()
  for (let mod of todaysModules) {
    const start = mod.getStartDate(now)
    const end = mod.getEndDate(now)
    if (now >= start && now < end) {
      return mod
    }
  }
  return null
}

export function getLastModuleOfDay(date) {
  const dayOfWeek = date.getDay()
  const modules = weeklySchedule.filter((m) => m.dayOfWeek === dayOfWeek)
  if (modules.length === 0) return null

  // Sort by end time descending
  modules.sort((a, b) => {
    if (a.endHour === b.endHour) return b.endMinute - a.endMinute
    return b.endHour - a.endHour
  })
  return modules[0]
}
