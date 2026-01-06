import { getNow } from './time.js'
// import { vacations } from './vacances.js' // Removed
import { useScheduleStore } from '../stores/scheduleStore'

// Helper to get schedule from store safely
function getSchedule() {
  const store = useScheduleStore()
  return store.weeklySchedule
}

/**
 * Retourne les modules prévus pour aujourd'hui.
 * @returns {Array} Modules du jour courant.
 */
export function getTodaysModules() {
  const today = getNow()
  const dayOfWeek = today.getDay() // 0 = dimanche, 1 = lundi, etc.
  return getSchedule().filter((mod) => mod.dayOfWeek === dayOfWeek)
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

  for (let mod of getSchedule()) {
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

  for (let mod of getSchedule()) {
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

import { getUpcomingVacations } from './vacances.js'

export function isDuringVacation(date) {
  // On parcourt la liste des vacances depuis le store via le helper
  const vacs = getUpcomingVacations()
  return vacs.some((vac) => {
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
  let dailyModules = getSchedule()
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
  if (isDuringVacation(now)) return null

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

export function getFirstModuleOfDay(date) {
  const dayOfWeek = date.getDay()
  const modules = getSchedule().filter((m) => m.dayOfWeek === dayOfWeek)
  if (modules.length === 0) return null

  // Sort by start time ascending
  modules.sort((a, b) => {
    if (a.startHour === b.startHour) return a.startMinute - b.startMinute
    return a.startHour - b.startHour
  })
  return modules[0]
}

export function getLastModuleOfDay(date) {
  const dayOfWeek = date.getDay()
  const modules = getSchedule().filter((m) => m.dayOfWeek === dayOfWeek)
  if (modules.length === 0) return null

  // Sort by end time descending
  modules.sort((a, b) => {
    if (a.endHour === b.endHour) return b.endMinute - a.endMinute
    return b.endHour - a.endHour
  })
  return modules[0]
}
