// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VCalendar } from 'vuetify/labs/VCalendar'
// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  components: {
    VCalendar,
  },
  theme: {
    themes: {
      light: {
        colors: {
          darkblue: '#020B2C',
          red: '#D32F2F'
        }
      }
    }
  }
  
})