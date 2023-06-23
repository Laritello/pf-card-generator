// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { en, ru } from 'vuetify/locale'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  locale: {
    locale: 'ru',
    fallback: 'en',
    messages: { ru, en },
  },
  components: {
    VDataTable,
  },
})
