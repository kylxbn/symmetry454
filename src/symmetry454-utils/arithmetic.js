class SymmetryArithmetic {
  /**
   * Intializes the Symmetry arithmetic
   *
   * @param {boolean} altCalendar - Use a different calendar (30-31-30) instead of 4-5-4
   * @param {boolean} altCycle - Use a different cycle better for approximating the mean north solstice
   * @param {boolean} altEpoch - Use 2001 January 1 as the epoch, else use CCUE rata die
   */
  constructor (altCalendar = false, altCycle = false, altEpoch = false) {
    this.symEpoch = altEpoch ? -730484 : 1 // CCUE rata die
    this.gregorianEpoch = this.symEpoch
    this.weekdayAdjust = (this.symEpoch - 1) % 7

    this.altCalendar = altCalendar

    if (altCycle) { // ideal for approximating the mean north solstice
      this.c = 389
      this.l = 69
      this.k = 194
    } else { // ideal for approximating the mean northward equinox
      this.c = 293 // years per cycle
      this.l = 52 // leap years per cycle
      this.k = (this.c - 1) / 2 // ensures that leap years are symmetrically arranged
    }
  }

  /**
   * Get the weekday of a fixed date
   *
   * @param {number} fixedDate - The fixed date
   * @returns {number}
   */
  fixedToWeekdayNum (fixedDate) {
    return (Math.floor(fixedDate) - this.weekdayAdjust) % 7
  }

  /**
   * Returns the number of calendar days that have elapsed from the Gregorian epoch
   * until the beginning of the New Year Day of the specified Gregorian year number
   *
   * @param {number} gregYear - The Gregorian year
   * @returns {number}
   */
  priorElapsedDays (gregYear) {
    const priorYear = gregYear - 1
    return this.gregorianEpoch + priorYear * 365 +
      Math.floor(priorYear / 4) - Math.floor(priorYear / 100) + Math.floor(priorYear / 400) - 1
  }

  /**
   * Returns whether the gregorian year is a leap year
   *
   * @param {number} year - The Gregorian year
   * @returns {boolean}
   */
  isGregorianLeapYear (year) {
    if (year % 4 !== 0) {
      return false
    } else if (year % 100 !== 0) {
      return true
    } else if (year % 400 !== 0) {
      return false
    } else {
      return true
    }
  }

  /**
   * Returns whether the symmetry year is a leap year
   *
   * @param {number} year - the Symmetry year
   * @returns {boolean}
   */
  isSymLeapYear (year) {
    return ((this.l * year + this.k) % this.c) < this.l
  }

  /**
   * Returns the fixed day number of the New Year Day of
   * any specified symmetry454 year
   *
   * @param {number} year - The symmetry year
   * @returns {number}
   */
  symNewYearDay (year) {
    const e = year - 1
    return this.symEpoch + 364 * e + 7 * Math.floor((this.l * e + this.k) / this.c)
  }

  /**
   * Returns the ordinal day number within the gregorian year
   *
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @returns {number}
   */
  gregorianOrdinalDay (year, month, day) {
    let res = Math.floor((367 * month - 362) / 12) + day
    if (month > 2) {
      if (this.isGregorianLeapYear(year)) {
        res -= 1
      } else {
        res -= 2
      }
    }
    return res
  }

  /**
   * Calculates the number of days elapsed in the same year prior to a specified month (4-5-4 version)
   *
   * @param {number} month - The symmetry month
   * @returns {number}
   */
  daysBeforeMonth (month) {
    if (this.altCalendar) {
      return 30 * (month - 1) + Math.floor(month / 3)
    } else {
      return 28 * (month - 1) + 7 * Math.floor(month / 3)
    }
  }

  /**
   * Calculate the ordinal day number of a given symDay within a given symMonth
   * @param {number} month - Symmetry month
   * @param {number} day - Symmetry day
   * @returns {number}
   */
  symDayOfYear (month, day) {
    return this.daysBeforeMonth(month) + day
  }

  /**
   * Converts any Sym454 or Sym010 calendar date to the corresponsing fixed day number
   * @param year
   * @param month
   * @param day
   * @returns {number}
   */
  symToFixed (year, month, day) {
    return this.symNewYearDay(year) + this.symDayOfYear(month, day) - 1
  }

  /**
   * Get the cycle mean year
   *
   * @returns {number}
   */
  getCycleMeanYear () {
    return (this.c * 364 + this.l * 7) / this.c
  }

  /**
   * Converts a fixed date to symyear
   *
   * @param {number} fixedDate - The fixed date
   * @returns {{symYear: number, startOfYear: number}}
   */
  fixedToSymYear (fixedDate) {
    const cycleMeanYear = this.getCycleMeanYear()
    let symYear = Math.ceil((fixedDate - this.symEpoch) / cycleMeanYear)

    let startOfYear = this.symNewYearDay(symYear)
    if (startOfYear < fixedDate) {
      // SymYear starts before fixedDate and is either correct or needs to be incremented
      if (fixedDate - startOfYear >= 364) {
        const startOfNextYear = this.symNewYearDay(symYear + 1)
        if (fixedDate >= startOfNextYear) {
          // fixedDate is on or after the start of next year, so next year is the correct year
          // Increment the estimated year number and return its New Year Day
          symYear += 1
          startOfYear = startOfNextYear
        }
      }
    } else if (startOfYear > fixedDate) {
      // Estimated SymYear too far into the future, go back a year and recalculate the new year day
      symYear -= 1
      startOfYear = this.symNewYearDay(symYear)
    }

    return {
      symYear,
      startOfYear
    }
  }

  /**
   * Converts a fixed date to symmetry
   * @param {number} fixedDate
   * @returns {{weekOfYear: number, dayOfYear: number, weekOfMonth: number, weekday: number, weeksInMonth: number, symDay: number, weekOfQuarter: number, daysInMonth: number, symMonth: number, symYear: number, startOfYear: number, monthOfQuarter: number, daysInYear: number, dayOfQuarter: number, weeksInYear: number, quarter: number}}
   */
  fixedToSym (fixedDate) {
    const { symYear, startOfYear } = this.fixedToSymYear(fixedDate)
    const dayOfYear = fixedDate - startOfYear + 1
    const weekOfYear = Math.ceil(dayOfYear / 7)
    const quarter = Math.ceil((4 / 53) * weekOfYear)
    const dayOfQuarter = dayOfYear - 91 * (quarter - 1)
    const weekOfQuarter = Math.ceil(dayOfQuarter / 7)
    let monthOfQuarter = null
    if (this.altCalendar) {
      monthOfQuarter = Math.ceil((2 / 61) * dayOfQuarter)
    } else {
      monthOfQuarter = Math.ceil((2 / 9) * weekOfQuarter)
    }
    if (monthOfQuarter > 3) {
      monthOfQuarter = 3
    }
    const symMonth = 3 * (quarter - 1) + monthOfQuarter
    const isLeapYear = this.isSymLeapYear(symYear)
    const daysInYear = isLeapYear ? 371 : 364
    const weeksInYear = isLeapYear ? 53 : 52
    let daysInMonth = null
    if (this.altCalendar) {
      daysInMonth = 30 + Math.floor((symMonth % 3) / 2)
    } else {
      daysInMonth = 28 + 7 * Math.floor((symMonth % 3) / 2)
    }
    if (symMonth === 12) {
      if (isLeapYear) {
        daysInMonth += 7
      }
    }
    let weeksInMonth = 0
    if (!this.altCalendar) {
      weeksInMonth = 4 + Math.floor((symMonth % 3) / 2)
    }
    const symDay = dayOfYear - this.daysBeforeMonth(symMonth)
    let weekOfMonth = 0
    if (!this.altCalendar) {
      weekOfMonth = Math.ceil(symDay / 7)
    }
    const weekday = this.fixedToWeekdayNum(fixedDate)

    return {
      symYear,
      symMonth,
      symDay,
      weekday,
      startOfYear,
      weeksInYear,
      weekOfYear,
      daysInYear,
      dayOfYear,
      quarter,
      monthOfQuarter,
      weekOfQuarter,
      dayOfQuarter,
      weekOfMonth,
      weeksInMonth,
      daysInMonth
    }
  }

  /**
   * Convert a gregorian date to fixed date
   *
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @returns {number}
   */
  gregorianToFixed (year, month, day) {
    let ret = this.gregorianEpoch - 1 + 365 * (year - 1) +
      Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
      Math.floor((year - 1) / 400) + Math.floor((1 / 12) * (367 * month - 362)) + day
    if (month > 2) {
      if (this.isGregorianLeapYear(year)) {
        ret -= 1
      } else {
        ret -= 2
      }
    }

    return ret
  }

  /**
   * Gets the symmetry date now
   *
   * @returns {{weekOfYear: number, dayOfYear: number, weekOfMonth: number, weekday: number, weeksInMonth: number, symDay: number, weekOfQuarter: number, daysInMonth: number, symMonth: number, symYear: number, startOfYear: number, monthOfQuarter: number, daysInYear: number, dayOfQuarter: number, weeksInYear: number, quarter: number}}
   */
  now () {
    const now = new Date()
    const gregFix = this.gregorianToFixed(now.getFullYear(), now.getMonth() + 1, now.getDate())
    return this.fixedToSym(gregFix)
  }

  /**
   * Converts gregorian to symmetry date
   * @param year
   * @param month
   * @param day
   * @returns {{weekOfYear: number, dayOfYear: number, weekOfMonth: number, weekday: number, weeksInMonth: number, symDay: number, weekOfQuarter: number, daysInMonth: number, symMonth: number, symYear: number, startOfYear: number, monthOfQuarter: number, daysInYear: number, dayOfQuarter: number, weeksInYear: number, quarter: number}}
   */
  convert (year, month, day) {
    const gregFix = this.gregorianToFixed(year, month, day)
    return this.fixedToSym(gregFix)
  }

  /**
   * Create sym date from ymd
   *
   * @param year
   * @param month
   * @param day
   * @returns {{weekOfYear: number, dayOfYear: number, weekOfMonth: number, weekday: number, weeksInMonth: number, symDay: number, weekOfQuarter: number, daysInMonth: number, symMonth: number, symYear: number, startOfYear: number, monthOfQuarter: number, daysInYear: number, dayOfQuarter: number, weeksInYear: number, quarter: number}}
   */
  create (year, month, day) {
    const symFix = this.symToFixed(year, month, day)
    return this.fixedToSym(symFix)
  }
}

module.exports = SymmetryArithmetic
