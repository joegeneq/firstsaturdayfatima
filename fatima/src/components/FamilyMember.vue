<template>
    <div>
      <h2>Add Family Member</h2>
      <form @submit.prevent="addFamilyMember">
        <label for="name">Name:</label>
        <input type="text" v-model="form.name" id="name" required />
        <br />
        <label for="family">Family:</label>
        <select v-model="form.family" id="family" required>
          <option value="" disabled>Select Family</option>
          <option v-for="family in families" :key="family.id" :value="family.id">
            {{ family.family_name }}
          </option>
        </select>
        <br />
        <button type="submit">Add Member</button>
      </form>
  
      <p v-if="loadingFamilies">Loading Families...</p>
      <p v-if="memberAdded">Member added successfully!</p>
      <p v-if="memberError">Error adding member: {{ memberError }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../lib/supabaseClient';
  
  const form = ref({
    name: '',
    family: '',
  });
  
  const families = ref([]);
  const loadingFamilies = ref(false);
  const memberAdded = ref(false);
  const memberError = ref(null);
  
  const fetchFamilies = async () => {
    loadingFamilies.value = true;
    try {
      const { data, error } = await supabase.from('family').select('*');
      if (error) {
        console.error('Error fetching families:', error);
      } else {
        families.value = data;
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    } finally {
      loadingFamilies.value = false;
    }
  };
  /*
  const addFamilyMember = async () => {
    memberAdded.value = false;
    memberError.value = null;
  
    try {
      const { error } = await supabase.from('family_member').insert([
        {
          name: form.value.name,
          family_id: form.value.family,
        },
      ]);
  
      if (error) {
        console.error('Error adding family member:', error);
        memberError.value = error.message;
      } else {
        console.log('Family member added successfully.');
        memberAdded.value = true;
        form.value.name = ''; //reset form input
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      memberError.value = 'An unexpected error occurred.';
    }
  };
  */
  onMounted(fetchFamilies);
  </script>