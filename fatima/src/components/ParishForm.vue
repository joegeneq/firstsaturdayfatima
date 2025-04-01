<template>
    <div>
      <h2>Parish and Family Form</h2>
      <form @submit.prevent="submitForm">
        <label for="parish">Parish:</label>
        <select v-model="form.parish" id="parish" required>
          <option value="" disabled>Select a parish</option>
          <option v-for="parish in parishes" :key="parish.id" :value="parish.id">{{ parish.parish_name }}</option>
        </select>
        <br>
        <label for="family">Family:</label>
        <input type="text" v-model="form.family" id="family" required />
        <br>
        <button type="submit">Submit</button>
      </form>
      <p v-if="loading">Loading parishes...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../lib/supabaseClient';
  
  const parishes = ref([]);
  const form = ref({
    parish: '',
    family: ''
  });
  const loading = ref(false);
  
  const fetchParishes = async () => {
    loading.value = true;
    let { data, error } = await supabase.from('parish_hierarchy').select('*');
    if (error) {
      console.error('Error fetching parishes:', error);
    } else {
      parishes.value = data;
    }
    loading.value = false;
  };
  
  const submitForm = () => {
    console.log('Form submitted:', form.value);
    // You can add Supabase insert logic here
  };
  
  onMounted(fetchParishes);
  </script>
  