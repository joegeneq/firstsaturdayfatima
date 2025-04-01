import { createApp } from 'vue'

import App from './App.vue'
import ParishForm from './components/ParishForm.vue'
import FamilyMember from './components/FamilyMember.vue'


const app = createApp(App)

app.component('family-member', FamilyMember)

app.mount('#app')