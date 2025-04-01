// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import FamilyMember from '../components/FamilyMember.vue'; // Adjust path as needed
import ParishForm from '../components/ParishForm.vue';
import App from '../App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: App },
    { path: '/family-members', component: FamilyMember },
    { path: '/parish-form', component: ParishForm}
  ],
});

export default router;