<template>
  <div class="container mx-auto p-4 bg-gray-50 min-h-screen rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold mb-6 text-indigo-700">Pledge Lookup</h2>

    <!-- Filter Section -->
    <div class="mb-6 bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Filter Pledges</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="filterFamilyName" class="block text-sm font-medium text-gray-700 mb-1">Family Name:</label>
          <input
            type="text"
            id="filterFamilyName"
            v-model="filters.family_name"
            @input="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Type family name"
          />
        </div>
        <div>
          <label for="filterParishName" class="block text-sm font-medium text-gray-700 mb-1">Parish Name:</label>
          <input
            type="text"
            id="filterParishName"
            v-model="filters.parish_name"
            @input="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Type parish name"
          />
        </div>
        <div>
          <label for="filterCityName" class="block text-sm font-medium text-gray-700 mb-1">City Name:</label>
          <input
            type="text"
            id="filterCityName"
            v-model="filters.city_name"
            @input="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Type city name"
          />
        </div>
        <div>
          <label for="filterProvinceName" class="block text-sm font-medium text-gray-700 mb-1">Province Name:</label>
          <input
            type="text"
            id="filterProvinceName"
            v-model="filters.province_name"
            @input="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Type province name"
          />
        </div>
      </div>
    </div>

    <!-- Loading and Error States -->
    <p v-if="loading" class="text-center text-indigo-600 text-lg my-8">Loading pledges...</p>
    <p v-else-if="error" class="text-center text-red-600 text-lg my-8">Error: {{ error }}</p>
    <p v-else-if="pledges.length === 0 && (filters.family_name || filters.parish_name || filters.city_name || filters.province_name)" class="text-center text-gray-600 text-lg my-8">No pledges found matching your filters.</p>
    <p v-else-if="pledges.length === 0" class="text-center text-gray-600 text-lg my-8">No pledge data available.</p>

    <!-- Pledges Table -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th @click="setSort('family_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              Family Name
              <span v-if="sortColumn === 'family_name'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th @click="setSort('parish_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              Parish Name
              <span v-if="sortColumn === 'parish_name'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th @click="setSort('city_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              City Name
              <span v-if="sortColumn === 'city_name'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th @click="setSort('province_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              Province Name
              <span v-if="sortColumn === 'province_name'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="pledge in pledges" :key="pledge.family_id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ pledge.family_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ pledge.parish_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ pledge.city_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ pledge.province_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct

const pledges = ref([]);
const loading = ref(true);
const error = ref(null);

const filters = ref({
  family_name: '',
  parish_name: '',
  city_name: '',
  province_name: '',
});

const sortColumn = ref(null);
const sortDirection = ref('asc'); // 'asc' or 'desc'

// Function to fetch pledges based on current filters and sort order
const fetchPledges = async () => {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase.from('pledge_lookup').select('*');

    // Apply filters
    if (filters.value.family_name) {
      query = query.ilike('family_name', `%${filters.value.family_name}%`);
    }
    if (filters.value.parish_name) {
      query = query.ilike('parish_name', `%${filters.value.parish_name}%`);
    }
    if (filters.value.city_name) {
      query = query.ilike('city_name', `%${filters.value.city_name}%`);
    }
    if (filters.value.province_name) {
      query = query.ilike('province_name', `%${filters.value.province_name}%`);
    }

    // Apply sorting
    if (sortColumn.value) {
      query = query.order(sortColumn.value, { ascending: sortDirection.value === 'asc' });
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    pledges.value = data;
  } catch (err) {
    console.error('Error fetching pledges:', err);
    error.value = err.message || 'Could not fetch pledge data.';
  } finally {
    loading.value = false;
  }
};

// Trigger fetchPledges when filter inputs change
const applyFilters = () => {
  fetchPledges();
};

// Set sort column and direction
const setSort = (column) => {
  if (sortColumn.value === column) {
    // If clicking the same column, toggle direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // If clicking a new column, set it to ascending
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  fetchPledges(); // Re-fetch with new sort order
};

onMounted(() => {
  fetchPledges(); // Fetch initial data when component mounts
});
</script>

<style scoped>
/* Scoped styles for the component */
/* Tailwind provides most styling, but you can add custom ones here if needed */
</style>