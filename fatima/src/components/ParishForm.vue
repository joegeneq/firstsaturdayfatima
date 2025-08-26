<template>
  <div>
    <h2>Parish and Pledge Form</h2>
    <form @submit.prevent="submitForm">
      <label for="parish">Parish:</label>
      <input
        type="text"
        class="my-input"
        v-model="searchQuery"
        id="parish"
        placeholder="Search for a parish..."
        @input="handleSearch"
      />
      <ul v-if="filteredParishes.length > 0">
        <li
          v-for="parish in filteredParishes"
          :key="parish.parish_id"
          @click="selectParish(parish)"
        >
          {{ parish.church_name }}-{{ parish.city_name }}-{{ parish.province_name }}
        </li>
      </ul>
      <p v-else-if="filteredParishes.length === 0">No matching parishes found.</p>
      <br />
      <label for="family">Name:</label>
      <input type="text" v-model="form.family" id="family" required />
      <br />
      <button type="submit">Submit</button>
    </form>
    <p v-if="loading">Loading parishes...</p>
    <p v-if="submissionSuccess">Pledge added successfully!</p>
    <p v-if="submissionError">Error adding family: {{ submissionError }}</p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
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
const showDropdown = ref(false);

const handleSearch = () => {
  if (searchQuery.value.length >= 3) {
    fetchParishes();
  } else {
    parishes.value = [];
  }
};

const fetchParishes = async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from('parish_lookup')
    .select('parish_id, church_name, city_name, province_name')
    .ilike('church_name', `%${searchQuery.value}%`)
    .limit(100); 

  if (error) {
    console.error('Error fetching parishes:', error);
  } else {
    parishes.value = data;
  }
  loading.value = false;
};

const filteredParishes = computed(() => {
  return parishes.value;
});

const selectParish = (parish) => {
  form.value.parish = parish.parish_id;
  searchQuery.value = `${parish.church_name}-${parish.city_name}-${parish.province_name}`;
  parishes.value = []; // Clear the dropdown after selection
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
      searchQuery.value = '';
      form.value.parish = '';
    }
  } catch (err) {
      console.error('An unexpected error occurred:', err);
      submissionError.value = 'An unexpected error occurred.';
  }
};

</script>

<style scoped>

.my-input {
  width: 100%; /* Makes the input take full width of its parent */
  max-width: 500px; /* Limits the maximum width */
  box-sizing: border-box; /* Ensures padding and border are included in the width */
}


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