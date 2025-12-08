export class Module {
  constructor(moduleName, room, dayOfWeek, startHour, startMinute, endHour, endMinute) {
    this.moduleName = moduleName
    this.room = room
    this.dayOfWeek = dayOfWeek
    this.startHour = startHour
    this.startMinute = startMinute
    this.endHour = endHour
    this.endMinute = endMinute
  }

  getStartDate(currentDate) {
    let start = new Date(currentDate)
    start.setHours(this.startHour, this.startMinute, 0, 0)
    return start
  }

  getEndDate(currentDate) {
    let end = new Date(currentDate)
    end.setHours(this.endHour, this.endMinute, 0, 0)
    return end
  }

  estEnCours(now) {
    if (now.getDay() !== this.dayOfWeek) return false
    const start = this.getStartDate(now)
    const end = this.getEndDate(now)
    return now >= start && now < end
  }
}
