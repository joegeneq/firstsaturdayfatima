import { createApp } from 'vue'

import App from './App.vue'
import FoodItem from './components/FoodItem.vue'
import NewComponent1 from './components/NewComponent1.vue'

const app = createApp(App)
app.component('food-item', FoodItem)
app.component('new-component-1', NewComponent1)
app.mount('#app')