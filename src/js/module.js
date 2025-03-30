/* module.js - Classe Module
   - Représente un module récurrent avec ses horaires et sa salle.
   - Fournit des méthodes pour obtenir les dates de début et de fin, et vérifier si le module est en cours.
*/
export class Module {
  /**
   * Crée une instance de Module.
   * @param {string} moduleName - Nom du module.
   * @param {string} room - Salle du module.
   * @param {number} dayOfWeek - Jour de la semaine (0 = dimanche, 1 = lundi, …, 6 = samedi).
   * @param {number} startHour - Heure de début.
   * @param {number} startMinute - Minute de début.
   * @param {number} endHour - Heure de fin.
   * @param {number} endMinute - Minute de fin.
   */
  constructor(moduleName, room, dayOfWeek, startHour, startMinute, endHour, endMinute) {
    this.moduleName = moduleName;
    this.room = room;
    this.dayOfWeek = dayOfWeek;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.endHour = endHour;
    this.endMinute = endMinute;
  }

  /**
   * Renvoie un objet Date représentant l'heure de début pour la journée donnée.
   * @param {Date} currentDate - Date de référence.
   * @returns {Date} Date de début du module.
   */
  getStartDate(currentDate) {
    let start = new Date(currentDate);
    start.setHours(this.startHour, this.startMinute, 0, 0);
    return start;
  }

  /**
   * Renvoie un objet Date représentant l'heure de fin pour la journée donnée.
   * @param {Date} currentDate - Date de référence.
   * @returns {Date} Date de fin du module.
   */
  getEndDate(currentDate) {
    let end = new Date(currentDate);
    end.setHours(this.endHour, this.endMinute, 0, 0);
    return end;
  }

  /**
   * Vérifie si le module est en cours à l'instant donné.
   * @param {Date} now - Date et heure actuelles.
   * @returns {boolean} True si le module est en cours, sinon false.
   */
  estEnCours(now) {
    if (now.getDay() !== this.dayOfWeek) return false;
    const start = this.getStartDate(now);
    const end = this.getEndDate(now);
    return now >= start && now < end;
  }
}
