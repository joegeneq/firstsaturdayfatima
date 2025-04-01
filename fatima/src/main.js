import { createApp } from 'vue'

import App from './App.vue'
import ParishForm from './components/ParishForm.vue'

const app = createApp(App)

app.component('parish-form', ParishForm)

app.mount('#app')