<template>
  <div class="container mx-auto p-4 bg-gray-50 min-h-screen rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold mb-8 text-indigo-700">Parish Management</h2>

    <div class="mb-8 bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Add New Parish</h3>
      <form @submit.prevent="insertParish" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label for="church_name" class="block text-sm font-medium text-gray-700 mb-1">Church Name:</label>
          <input
            type="text"
            id="church_name"
            v-model="newParish.church_name"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="e.g., St. Peter's Parish"
          />
        </div>
        <div>
          <label for="church_address" class="block text-sm font-medium text-gray-700 mb-1">Address:</label>
          <input
            type="text"
            id="church_address"
            v-model="newParish.church_address"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="e.g., 123 Main St"
          />
        </div>
        <div>
          <label for="church_url" class="block text-sm font-medium text-gray-700 mb-1">Website URL:</label>
          <input
            type="url"
            id="church_url"
            v-model="newParish.church_url"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="e.g., https://example.com"
          />
        </div>
        <div class="relative">
          <label for="city_search" class="block text-sm font-medium text-gray-700 mb-1">City:</label>
          <input
            type="text"
            id="city_search"
            v-model="citySearchQuery"
            @input="handleCitySearch"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Search city"
          />
          <ul v-if="filteredCities.length > 0 && citySearchQuery.length >= 3" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            <li
              v-for="city in filteredCities"
              :key="city.id"
              @click="selectCity(city)"
              class="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white text-sm"
            >
              {{ city.city }}
            </li>
          </ul>
          <p v-else-if="citySearchQuery.length >= 3 && !loadingCities && filteredCities.length === 0" class="text-sm text-gray-500 mt-1">No cities found.</p>
        </div>
        <div class="relative">
          <label for="province_search" class="block text-sm font-medium text-gray-700 mb-1">Province:</label>
          <input
            type="text"
            id="province_search"
            v-model="provinceSearchQuery"
            @input="handleProvinceSearch"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Search province"
          />
          <ul v-if="filteredProvinces.length > 0 && provinceSearchQuery.length >= 3" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            <li
              v-for="province in filteredProvinces"
              :key="province.id"
              @click="selectProvince(province)"
              class="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white text-sm"
            >
              {{ province.province }}
            </li>
          </ul>
          <p v-else-if="provinceSearchQuery.length >= 3 && !loadingProvinces && filteredProvinces.length === 0" class="text-sm text-gray-500 mt-1">No provinces found.</p>
        </div>
        <div class="relative">
          <label for="diocese_search" class="block text-sm font-medium text-gray-700 mb-1">Diocese:</label>
          <input
            type="text"
            id="diocese_search"
            v-model="dioceseSearchQuery"
            @input="handleDioceseSearch"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Search diocese"
          />
          <ul v-if="filteredDioceses.length > 0 && dioceseSearchQuery.length >= 3" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            <li
              v-for="diocese in filteredDioceses"
              :key="diocese.id"
              @click="selectDiocese(diocese)"
              class="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white text-sm"
            >
              {{ diocese.diocese_name }} - {{ diocese.diocese_category.diocese_category }}
            </li>
          </ul>
          <p v-else-if="dioceseSearchQuery.length >= 3 && !loadingDioceses && filteredDioceses.length === 0" class="text-sm text-gray-500 mt-1">No dioceses found.</p>
        </div>
        
        <div class="md:col-span-3 text-right">
          <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            Add Parish
          </button>
        </div>
      </form>
      <p v-if="insertLoading" class="text-center text-indigo-600 mt-4">Adding parish...</p>
      <p v-if="insertSuccess" class="text-center text-green-600 mt-4">Parish added successfully!</p>
      <p v-if="insertError" class="text-center text-red-600 mt-4">Error adding parish: {{ insertError }}</p>
    </div>

    <div class="mb-6 bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Filter Parishes</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="filterChurchName" class="block text-sm font-medium text-gray-700 mb-1">Church Name:</label>
          <input
            type="text"
            id="filterChurchName"
            v-model="filters.church_name"
            @input="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Filter by church name"
          />
        </div>
        <div class="relative">
          <label for="filterCity" class="block text-sm font-medium text-gray-700 mb-1">City:</label>
          <input
            type="text"
            id="filterCity"
            v-model="filters.city"
            @input="handleTableCitySearch"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Filter by city"
          />
          <ul v-if="tableFilterDropdowns.city.length > 0 && filters.city.length >= 3" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            <li
              v-for="item in tableFilterDropdowns.city"
              :key="item.id"
              @click="selectTableFilter('city', item.city, item.id)"
              class="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white text-sm"
            >
              {{ item.city }}
            </li>
          </ul>
        </div>
        <div class="relative">
          <label for="filterProvince" class="block text-sm font-medium text-gray-700 mb-1">Province:</label>
          <input
            type="text"
            id="filterProvince"
            v-model="filters.province"
            @input="handleTableProvinceSearch"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Filter by province"
          />
          <ul v-if="tableFilterDropdowns.province.length > 0 && filters.province.length >= 3" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            <li
              v-for="item in tableFilterDropdowns.province"
              :key="item.id"
              @click="selectTableFilter('province', item.province, item.id)"
              class="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white text-sm"
            >
              {{ item.province }}
            </li>
          </ul>
        </div>
        <div class="relative">
          <label for="filterDiocese" class="block text-sm font-medium text-gray-700 mb-1">Diocese:</label>
          <input
            type="text"
            id="filterDiocese"
            v-model="filters.diocese_name"
            @input="handleTableDioceseSearch"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Filter by diocese"
          />
          <ul v-if="tableFilterDropdowns.diocese.length > 0 && filters.diocese_name.length >= 3" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            <li
              v-for="item in tableFilterDropdowns.diocese"
              :key="item.id"
              @click="selectTableFilter('diocese', item.diocese_name, item.id)"
              class="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white text-sm"
            >
              {{ item.diocese_name }} - {{ item.diocese_category.diocese_category }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <p v-if="loadingParishes" class="text-center text-indigo-600 text-lg my-8">Loading parishes...</p>
    <p v-else-if="parishFetchError" class="text-center text-red-600 text-lg my-8">Error: {{ parishFetchError }}</p>
    <p v-else-if="parishes.length === 0 && (filters.church_name || filters.city || filters.province || filters.diocese_name)" class="text-center text-gray-600 text-lg my-8">No parishes found matching your filters.</p>
    <p v-else-if="parishes.length === 0" class="text-center text-gray-600 text-lg my-8">No parish data available. Add a new parish above!</p>

    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th @click="setSort('church_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              Church Name
              <span v-if="sortColumn === 'church_name'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th @click="setSort('city.city')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              City
              <span v-if="sortColumn === 'city.city'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th @click="setSort('province.province')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              Province
              <span v-if="sortColumn === 'province.province'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th @click="setSort('diocese.diocese_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
              Diocese
              <span v-if="sortColumn === 'diocese.diocese_name'">{{ sortDirection === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="parish in parishes" :key="parish.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ parish.church_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ parish.city ? parish.city.city : 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ parish.province ? parish.province.province : 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ parish.diocese ? `${parish.diocese.diocese_name} - ${parish.diocese.diocese_category.diocese_category}` : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ parish.church_address || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              <a v-if="parish.church_url" :href="parish.church_url" target="_blank" class="text-indigo-600 hover:text-indigo-900">Link</a>
              <span v-else>N/A</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center mt-6">
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1" 
        class="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage >= totalPages" 
        class="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';

// --- Reactive State for Parishes Table ---
const parishes = ref([]);
const loadingParishes = ref(true);
const parishFetchError = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 100;

const filters = ref({
  church_name: '',
  city: '',
  province: '',
  diocese_name: '',
});

// New reactive variables to store the IDs for filtering
const filterCityId = ref(null);
const filterProvinceId = ref(null);
const filterDioceseId = ref(null);

const tableFilterDropdowns = ref({
  city: [],
  province: [],
  diocese: []
});

const sortColumn = ref(null);
const sortDirection = ref('asc');

// --- Reactive State for Insert Form ---
const newParish = ref({
  church_name: '',
  church_address: '',
  church_url: '',
  city_id: null,
  province_id: null,
  diocese_id: null,
});

const insertLoading = ref(false);
const insertSuccess = ref(false);
const insertError = ref(null);

// --- Reactive State for Dropdown Search (Insert Form) ---
const citySearchQuery = ref('');
const filteredCities = ref([]);
const loadingCities = ref(false);
const selectedCityId = ref(null);

const provinceSearchQuery = ref('');
const filteredProvinces = ref([]);
const loadingProvinces = ref(false);
const selectedProvinceId = ref(null);

const dioceseSearchQuery = ref('');
const filteredDioceses = ref([]);
const loadingDioceses = ref(false);
const selectedDioceseId = ref(null);

// --- Fetch Functions for Dropdown Data (Insert Form) ---
const fetchCities = async () => {
  loadingCities.value = true;
  let query = supabase.from('city').select('id, city');
  if (citySearchQuery.value.length >= 3) {
    query = query.ilike('city', `%${citySearchQuery.value}%`);
  } else {
    filteredCities.value = [];
    loadingCities.value = false;
    return;
  }
  const { data, error } = await query.limit(50);
  if (error) {
    console.error('Error fetching cities:', error);
    filteredCities.value = [];
  } else {
    filteredCities.value = data;
  }
  loadingCities.value = false;
};

const fetchProvinces = async () => {
  loadingProvinces.value = true;
  let query = supabase.from('province').select('id, province');
  if (provinceSearchQuery.value.length >= 3) {
    query = query.ilike('province', `%${provinceSearchQuery.value}%`);
  } else {
    filteredProvinces.value = [];
    loadingProvinces.value = false;
    return;
  }
  const { data, error } = await query.limit(50);
  if (error) {
    console.error('Error fetching provinces:', error);
    filteredProvinces.value = [];
  } else {
    filteredProvinces.value = data;
  }
  loadingProvinces.value = false;
};

const fetchDioceses = async () => {
  loadingDioceses.value = true;
  let query = supabase.from('diocese').select('id, diocese_name, diocese_category(diocese_category)');
  if (dioceseSearchQuery.value.length >= 3) {
    query = query.ilike('diocese_name', `%${dioceseSearchQuery.value}%`);
  } else {
    filteredDioceses.value = [];
    loadingDioceses.value = false;
    return;
  }
  const { data, error } = await query.limit(50);
  if (error) {
    console.error('Error fetching dioceses:', error);
    filteredDioceses.value = [];
  } else {
    filteredDioceses.value = data;
  }
  loadingDioceses.value = false;
};

// --- Dropdown Search Handlers (Insert Form) ---
const handleCitySearch = () => {
  if (citySearchQuery.value.length >= 3) {
    fetchCities();
  } else {
    filteredCities.value = [];
    selectedCityId.value = null;
    newParish.value.city_id = null;
  }
};

const handleProvinceSearch = () => {
  if (provinceSearchQuery.value.length >= 3) {
    fetchProvinces();
  } else {
    filteredProvinces.value = [];
    selectedProvinceId.value = null;
    newParish.value.province_id = null;
  }
};

const handleDioceseSearch = () => {
  if (dioceseSearchQuery.value.length >= 3) {
    fetchDioceses();
  } else {
    filteredDioceses.value = [];
    selectedDioceseId.value = null;
    newParish.value.diocese_id = null;
  }
};

// --- Dropdown Selection Handlers (Insert Form) ---
const selectCity = (city) => {
  newParish.value.city_id = city.id;
  citySearchQuery.value = city.city;
  filteredCities.value = [];
  selectedCityId.value = city.id;
};

const selectProvince = (province) => {
  newParish.value.province_id = province.id;
  provinceSearchQuery.value = province.province;
  filteredProvinces.value = [];
  selectedProvinceId.value = province.id;
};

const selectDiocese = (diocese) => {
  newParish.value.diocese_id = diocese.id;
  dioceseSearchQuery.value = `${diocese.diocese_name} - ${diocese.diocese_category.diocese_category}`;
  filteredDioceses.value = [];
  selectedDioceseId.value = diocese.id;
};

// --- Dynamic Filter Dropdowns (for the main table) ---

const handleTableCitySearch = async () => {
  if (filters.value.city.length >= 3) {
    const { data, error } = await supabase.from('city').select('id, city').ilike('city', `%${filters.value.city}%').limit(50);
    if (!error) {
      tableFilterDropdowns.value.city = data;
    } else {
      console.error('Error fetching city filters:', error);
    }
  } else {
    tableFilterDropdowns.value.city = [];
    if (filters.value.city === '') {
      filterCityId.value = null; // Clear the ID
      applyFilters();
    }
  }
};

const handleTableProvinceSearch = async () => {
  if (filters.value.province.length >= 3) {
    const { data, error } = await supabase.from('province').select('id, province').ilike('province', `%${filters.value.province}%').limit(50);
    if (!error) {
      tableFilterDropdowns.value.province = data;
    } else {
      console.error('Error fetching province filters:', error);
    }
  } else {
    tableFilterDropdowns.value.province = [];
    if (filters.value.province === '') {
      filterProvinceId.value = null; // Clear the ID
      applyFilters();
    }
  }
};

const handleTableDioceseSearch = async () => {
  if (filters.value.diocese_name.length >= 3) {
    const { data, error } = await supabase.from('diocese').select('id, diocese_name, diocese_category(diocese_category)').ilike('diocese_name', `%${filters.value.diocese_name}%').limit(50);
    if (!error) {
      tableFilterDropdowns.value.diocese = data;
    } else {
      console.error('Error fetching diocese filters:', error);
    }
  } else {
    tableFilterDropdowns.value.diocese = [];
    if (filters.value.diocese_name === '') {
      filterDioceseId.value = null; // Clear the ID
      applyFilters();
    }
  }
};

const selectTableFilter = (filterType, value, id) => {
  if (filterType === 'city') {
    filters.value.city = value;
    filterCityId.value = id;
  } else if (filterType === 'province') {
    filters.value.province = value;
    filterProvinceId.value = id;
  } else if (filterType === 'diocese') {
    filters.value.diocese_name = value;
    filterDioceseId.value = id;
  }
  
  // Hide dropdown and trigger filter
  tableFilterDropdowns.value[filterType] = [];
  applyFilters();
};

// --- Main Parish Data Fetching, Filtering, Sorting, and Pagination ---
const fetchParishes = async () => {
  loadingParishes.value = true;
  parishFetchError.value = null;

  try {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    let query = supabase
      .from('parish')
      .select('*, city(city), province(province), diocese(diocese_name, diocese_category(diocese_category)))', { count: 'exact' });

    if (filters.value.church_name) {
      query = query.ilike('church_name', `%${filters.value.church_name}%`);
    }

    // Now filtering on foreign key IDs
    if (filterCityId.value) {
      query = query.eq('city_id', filterCityId.value);
    }
    if (filterProvinceId.value) {
      query = query.eq('province_id', filterProvinceId.value);
    }
    if (filterDioceseId.value) {
      query = query.eq('diocese_id', filterDioceseId.value);
    }

    if (sortColumn.value) {
      query = query.order(sortColumn.value, { ascending: sortDirection.value === 'asc' });
    }

    const { data, error: fetchError, count } = await query.range(start, end);

    if (fetchError) {
      throw fetchError;
    }

    parishes.value = data;
    totalPages.value = Math.ceil(count / itemsPerPage);

  } catch (err) {
    console.error('Error fetching parishes:', err);
    parishFetchError.value = err.message || 'Could not fetch parish data.';
  } finally {
    loadingParishes.value = false;
  }
};

const applyFilters = () => {
    currentPage.value = 1;
    fetchParishes();
};

const setSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1;
  fetchParishes();
};

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchParishes();
  }
};

// --- Insert New Parish ---
const insertParish = async () => {
  insertLoading.value = true;
  insertSuccess.value = false;
  insertError.value = null;

  if (!newParish.value.church_name) {
    insertError.value = 'Church Name is required.';
    insertLoading.value = false;
    return;
  }
  if (!newParish.value.city_id) {
    insertError.value = 'City is required. Please select from the search results.';
    insertLoading.value = false;
    return;
  }
  if (!newParish.value.province_id) {
    insertError.value = 'Province is required. Please select from the search results.';
    insertLoading.value = false;
    return;
  }
  if (!newParish.value.diocese_id) {
    insertError.value = 'Diocese is required. Please select from the search results.';
    insertLoading.value = false;
    return;
  }

  try {
    const { data, error: insertErr } = await supabase.from('parish').insert([
      {
        church_name: newParish.value.church_name,
        church_address: newParish.value.church_address || null,
        church_url: newParish.value.church_url || null,
        city_id: newParish.value.city_id,
        province_id: newParish.value.province_id,
        diocese_id: newParish.value.diocese_id,
      },
    ]);

    if (insertErr) {
      throw insertErr;
    }

    insertSuccess.value = true;
    newParish.value = { church_name: '', church_address: '', church_url: '', city_id: null, province_id: null, diocese_id: null };
    citySearchQuery.value = '';
    provinceSearchQuery.value = '';
    dioceseSearchQuery.value = '';
    selectedCityId.value = null;
    selectedProvinceId.value = null;
    selectedDioceseId.value = null;
    fetchParishes();
  } catch (err) {
    console.error('Error inserting parish:', err);
    insertError.value = err.message || 'Failed to add parish.';
  } finally {
    insertLoading.value = false;
  }
};

onMounted(() => {
  fetchParishes();
});
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>