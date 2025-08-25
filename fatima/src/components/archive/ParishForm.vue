<template>
  <div>
    <h2>Parish and Family Form</h2>
    <form @submit.prevent="submitForm">
      <label for="parish">Parish:</label>
      <input
        type="text"
        v-model="searchQuery"
        id="parish"
        placeholder="Search for a parish..."
      />
      <ul v-if="filteredParishes.length > 0">
        <li
          v-for="parish in filteredParishes"
          :key="parish.id"
          @click="selectParish(parish)"
        >
          {{ parish.parish_name }}-{{ parish.diocese_name }}-{{ parish.arch_diocese_name }}
        </li>
      </ul>
      <p v-else-if="searchQuery && !loading">No matching parishes found.</p>
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
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../lib/supabaseClient';

const parishes = ref([]);
const form = ref({
  parish: '',
  family: '',
});
const loading = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref(null);
const searchQuery = ref('');

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

const filteredParishes = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  return parishes.value.filter((parish) => {
    const searchStr = `${parish.parish_name} ${parish.diocese_name} ${parish.arch_diocese_name}`.toLowerCase();
    return searchStr.includes(searchQuery.value.toLowerCase());
  });
});

const selectParish = (parish) => {
  form.value.parish = parish.id;
  searchQuery.value = `${parish.parish_name}-${parish.diocese_name}-${parish.arch_diocese_name}`;
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
      form.value.family = '';
      searchQuery.value = ''; //reset the search query
      form.value.parish = ''; //reset the parish selection
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    submissionError.value = 'An unexpected error occurred.';
  }
};

onMounted(fetchParishes);
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
}

li {
  padding: 8px;
  cursor: pointer;
}

li:hover {
  background-color: #f0f0f0;
}
</style>