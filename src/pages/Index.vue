<template>
  <q-page padding>
    <div class="col">
      <calendar class="row-auto"></calendar>
    </div>
  </q-page>
</template>

<script>
import Symmetry454Date from '../symmetry454-utils/index'

import Calendar from 'components/Calendar'

export default {
  name: 'PageIndex',
  components: {
    Calendar
  },
  data () {
    const d = new Symmetry454Date()
    const sy = d.getYear()
    const sm = d.getMonth()
    const sd = d.getDate()

    return {
      dateNow: d,
      sy,
      sm,
      sd,
      shown: new Symmetry454Date(sy, sm, sd)
    }
  }
}
</script>

<style lang="scss">
</style>
