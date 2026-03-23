import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@/icons'

const app = createApp(App)

app.component('FaIcon', FontAwesomeIcon).mount('#app')
