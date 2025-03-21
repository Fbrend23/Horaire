// =================================================================================
// Classe Module
// ---------------------------------------------------------------------------------
// Cette classe représente un module récurrent dans l'agenda hebdomadaire.
// Chaque instance contient les informations suivantes :
//   - moduleName : Nom du module
//   - room       : Salle où se déroule le module
//   - dayOfWeek  : Jour de la semaine (0 = dimanche, 1 = lundi, …, 6 = samedi)
//   - startHour, startMinute : Heure et minute de début
//   - endHour, endMinute     : Heure et minute de fin
//
// Méthodes principales :
//   - getStartDate(currentDate) : Renvoie un objet Date pour le début du module
//   - getEndDate(currentDate)   : Renvoie un objet Date pour la fin du module
//   - estEnCours(now)           : Indique si le module est en cours à l'instant "now"
// =================================================================================

export class Module {
  constructor(moduleName, room, dayOfWeek, startHour, startMinute, endHour, endMinute) {
    this.moduleName = moduleName;
    this.room = room;
    this.dayOfWeek = dayOfWeek;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.endHour = endHour;
    this.endMinute = endMinute;
  }

  // Renvoie un objet Date représentant l'heure de début du module pour la journée donnée
  getStartDate(currentDate) {
    let start = new Date(currentDate);
    start.setHours(this.startHour, this.startMinute, 0, 0);
    return start;
  }

  // Renvoie un objet Date représentant l'heure de fin du module pour la journée donnée
  getEndDate(currentDate) {
    let end = new Date(currentDate);
    end.setHours(this.endHour, this.endMinute, 0, 0);
    return end;
  }

  // Vérifie si le module est en cours à l'instant "now"
  estEnCours(now) {
    if (now.getDay() !== this.dayOfWeek) return false;
    let start = this.getStartDate(now);
    let end = this.getEndDate(now);
    return now >= start && now < end;
  }
}
