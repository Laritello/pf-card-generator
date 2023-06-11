import { createApp } from 'vue'
import App from './components/App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App)
    .use(vuetify)
    .mount('#app')
