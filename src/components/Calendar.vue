<template>
  <div>
    <div class="row items-center q-mb-md">
      <div class="col text-h6">{{ shown.getYear() }} {{ shown.getMonthName() }}</div>
      <div class="col-auto q-mx-md">
        <q-btn-group>
          <q-btn @click="prev" icon="navigate_before" color="primary" padding="sm"></q-btn>
          <q-btn @click="next" icon="navigate_next" color="primary" padding="sm"></q-btn>
        </q-btn-group>
      </div>
      <div class="col-auto">
        <q-btn-dropdown color="primary" icon="today" padding="sm">
          <q-list>
            <q-item clickable v-close-popup @click="selectToday">
              <q-item-section>
                <q-item label>Select today</q-item>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="selectSymmetry">
              <q-item-section>
                <q-item label>Select Symmetry454 date</q-item>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="selectGregorian">
              <q-item-section>
                <q-item label>Select Gregorian date</q-item>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <table class="calendar-table">
      <tr>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
        <th>Sun</th>
      </tr>
      <tr v-for="i in Math.ceil(shown.getDaysInMonth() / 7)" :key="i">
        <td v-for="j in 7"
            :key="j"
            :class="{ selected: value.getFixedDate() === startOfShownMonth.getFixedDate() + (i-1) * 7 + j - 1}"
            @click="selectDate(startOfShownMonth.getFixedDate() + (i-1) * 7 + j - 1)"
        >
          <template
              v-if="(i-1)* 7 + j <= shown.getDaysInMonth()">
            {{ (i-1) * 7 + j }}
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Symmetry454Date from 'src/symmetry454-utils'

const isValidISODate = (date) => {
  return /^\d\d\d\d-\d\d-\d\d$/.test(date)
}

const getISODateComponents = (date) => {
  const res = {
    year: parseInt(date.substring(0, 4)),
    month: parseInt(date.substring(5, 7)),
    date: parseInt(date.substring(8, 10))
  }
  console.log(res)
  return res
}

export default {
  name: 'Calendar',
  data () {
    const d = new Symmetry454Date()
    return {
      value: d,
      shown: d
    }
  },
  computed: {
    startOfShownMonth () {
      return this.shown.getStartOfMonth()
    }
  },
  methods: {
    prev () {
      let currentMonth = this.shown.getMonth()
      let currentYear = this.shown.getYear()
      const currentDate = this.shown.getDate()
      currentMonth -= 1
      if (currentMonth < 1) {
        currentMonth = 12
        currentYear -= 1
      }
      this.shown = new Symmetry454Date(currentYear, currentMonth, currentDate)
    },
    next () {
      let currentMonth = this.shown.getMonth()
      let currentYear = this.shown.getYear()
      const currentDate = this.shown.getDate()
      currentMonth += 1
      if (currentMonth > 12) {
        currentMonth = 1
        currentYear += 1
      }
      this.shown = new Symmetry454Date(currentYear, currentMonth, currentDate)
    },
    selectToday () {
      this.shown = new Symmetry454Date()
      this.value = this.shown
    },
    selectDate (fixedDate) {
      this.value = new Symmetry454Date(fixedDate)
    },
    selectSymmetry () {
      this.$q.dialog({
        title: 'Select Symmetry454 date',
        message: 'Input date in ISO format',
        prompt: {
          model: ''
        },
        cancel: true
      }).onOk(data => {
        if (isValidISODate(data)) {
          const { year, month, date } = getISODateComponents(data)
          this.value = new Symmetry454Date(year, month, date)
          this.shown = this.value
        } else {
          this.$q.dialog({
            title: 'Error',
            message: 'Invalid ISO date'
          })
        }
      })
    },
    selectGregorian () {
      this.$q.dialog({
        title: 'Select Gregorian date',
        message: 'Input date in ISO format',
        prompt: {
          model: ''
        },
        cancel: true
      }).onOk(data => {
        if (isValidISODate(data)) {
          const { year, month, date } = getISODateComponents(data)
          this.value = new Symmetry454Date(year, month, date, null, true)
          this.shown = this.value
        } else {
          this.$q.dialog({
            title: 'Error',
            message: 'Invalid ISO date'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .calendar-table {
    border: solid 1px $grey-9;
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;

    th, td {
      border: solid 1px $grey-9;
      padding: 0.5em;
      text-align: center;
    }

    th {
      background: $secondary;
    }

    td {
      background: $grey-1;
      transition: all 200ms linear;
    }

    td:nth-child(6), td:nth-child(7) {
      background: $grey-5
    }

    td.selected {
      font-weight: bold;
      background: $accent;
      color: white;
      transform: scale(1.1);
    }
  }
</style>
