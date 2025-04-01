<template>
  <div>
    <h2>Parish and Family Form</h2>
    <form @submit.prevent="submitForm">
      <label for="parish">Parish:</label>
      <select v-model="form.parish" id="parish" required>
        <option value="" disabled>Select a parish</option>
        <option v-for="parish in parishes" :key="parish.id" :value="parish.id">
          {{ parish.parish_name }}-{{ parish.diocese_name }}-{{ parish.arch_diocese_name }}
        </option>
      </select>
      <br />
      <label for="family">Family:</label>
      <input type="text" v-model="form.family" id="family" required />
      <br />
      <button type="submit">Submit</button>
    </form>
    <p v-if="loading">Loading parishes...</p>
    <p v-if="submissionSuccess">Family added successfully!</p>
    <p v-if="submissionError">Error adding family: {{ submissionError }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';

const parishes = ref([]);
const form = ref({
  parish: '',
  family: '',
});
const loading = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref(null);

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

const submitForm = async () => {
  submissionSuccess.value = false;
  submissionError.value = null;

  try {
    const { error } = await supabase.from('family').insert([
      {
        parish_id: form.value.parish,
        family_name: form.value.family,
      },
    ]);

    if (error) {
      console.error('Error inserting family:', error);
      submissionError.value = error.message;
    } else {
      console.log('Family inserted successfully');
      submissionSuccess.value = true;
      // Optionally reset the form
      form.value.family = ''; //reset family form input
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    submissionError.value = 'An unexpected error occurred.';
  }
};

onMounted(fetchParishes);
</script>