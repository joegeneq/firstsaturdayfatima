// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import FamilyMember from '../components/FamilyMember.vue'; // Adjust path as needed
import ParishForm from '../components/ParishForm.vue';
import PledgeLookup from '../components/PledgeLookup.vue'; // Import the new component
import App from '../App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
//    { path: '/', component: App },
    { path: '/family-members', component: FamilyMember },
    { path: '/parish-form', component: ParishForm},
    { path: '/pledge-lookup', component: PledgeLookup }, // New route for PledgeLookup
//    { path: '/:catchAll(.*)', redirect: '/parish-form' }, // Redirect all unknown routes to /parish-form
  ],
});

export default router;