const SymmetryArithmetic = require('./arithmetic')

export default class Symmetry454Date {
  constructor (year = null, month = null, date = null, beats = null, gregorian = false) {
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]

    this._arithmetic = new SymmetryArithmetic()
    if (year && year > 9999) {
      this.fixedDate = year
      this.date = this._arithmetic.fixedToSym(this.fixedDate)
    } else if (year && month && date) {
      if (gregorian) {
        this.fixedDate = this._arithmetic.gregorianToFixed(year, month, date)
        this.date = this._arithmetic.fixedToSym(this.fixedDate)
      } else {
        this.fixedDate = this._arithmetic.symToFixed(year, month, date)
        this.date = this._arithmetic.fixedToSym(this.fixedDate)
      }
    } else {
      const now = new Date()
      this.fixedDate = this._arithmetic.gregorianToFixed(now.getFullYear(), now.getMonth() + 1, now.getDate())
      this.date = this._arithmetic.fixedToSym(this.fixedDate)
    }
  }

  getISO () {
    return this.getYear() + '-' + ('0' + this.getMonth()).slice(-2) + '-' + ('0' + this.getDate()).slice(-2)
  }

  getYear () {
    return this.date.symYear
  }

  getMonth () {
    return this.date.symMonth
  }

  getMonthName () {
    return this.monthNames[this.date.symMonth - 1]
  }

  getDate () {
    return this.date.symDay
  }

  /**
   * Gets this date's fixed date
   *
   * @returns number
   */
  getFixedDate () {
    return this.fixedDate
  }

  getDaysInMonth () {
    return this.date.daysInMonth
  }

  getStartOfMonth () {
    return new Symmetry454Date(this.getYear(), this.getMonth(), 1)
  }
}
