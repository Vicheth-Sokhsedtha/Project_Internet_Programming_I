<template>
  <div class="search-box">
    <input
      type="text"
      placeholder="Search product name (e.g. Dress)"
      v-model="query"
      @keyup.enter="handleSearch"
      @input="handleInput"
    />
    <span class="icon" @click="handleSearch">🔍</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const query = ref<string>("");

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'clear'): void
  (e: 'suggestionSelected', suggestion: string): void
}>();

// Recent searches stored in localStorage
const recentSearches = ref<string[]>([]);
const MAX_RECENT_SEARCHES = 5;

// Quick search suggestions
const commonSuggestions = [
  "Dress", "T-Shirt", "Jacket", "Hoodie",
  "Crop Top", "Shorts", "Skirt", "Jeans",
  "Summer Dress", "Working Dress"
];

// Filter suggestions based on current query
const suggestions = computed(() => {
  if (!query.value) return [];
  return commonSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.value.toLowerCase())
  );
});

// Load recent searches from localStorage
function loadRecentSearches(): void {
  const saved = localStorage.getItem('recentSearches');
  if (saved) {
    recentSearches.value = JSON.parse(saved);
  }
}

// Save recent searches to localStorage
function saveRecentSearches(): void {
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
}

// Handle search action
function handleSearch(): void {
  if (!query.value.trim()) {
    // If empty search, clear results
    emit('clear');
    return;
  }

  console.log("Search action triggered:", query.value);

  // Add to recent searches
  addToRecentSearches(query.value);

  // Check if query matches any suggestion
  const matchedSuggestion = commonSuggestions.find(suggestion =>
    suggestion.toLowerCase() === query.value.toLowerCase()
  );

  if (matchedSuggestion) {
    emit('suggestionSelected', matchedSuggestion);
  }

  // Emit search event to parent
  emit('search', query.value);
}

// Handle input change
function handleInput(): void {
  // Clear search if input is empty
  if (query.value.length === 0) {
    emit('clear');
  }

  // Auto-search if input matches a suggestion exactly
  const exactMatch = commonSuggestions.find(suggestion =>
    suggestion.toLowerCase() === query.value.toLowerCase()
  );

  if (exactMatch) {
    // Small delay to allow user to finish typing
    setTimeout(() => {
      if (query.value.toLowerCase() === exactMatch.toLowerCase()) {
        handleSearch();
      }
    }, 300);
  }
}

// Add query to recent searches
function addToRecentSearches(searchQuery: string): void {
  // Remove if already exists (to bring to top)
  const index = recentSearches.value.indexOf(searchQuery);
  if (index > -1) {
    recentSearches.value.splice(index, 1);
  }

  // Add to beginning
  recentSearches.value.unshift(searchQuery);

  // Keep only the most recent searches
  if (recentSearches.value.length > MAX_RECENT_SEARCHES) {
    recentSearches.value.pop();
  }

  // Save to localStorage
  saveRecentSearches();
}

// Clear recent searches (can be called from parent)
function clearRecentSearches(): void {
  recentSearches.value = [];
  localStorage.removeItem('recentSearches');
}

// Get recent searches (can be used by parent)
function getRecentSearches(): string[] {
  return recentSearches.value;
}

// Load recent searches on component mount
loadRecentSearches();

// Expose methods to parent component
defineExpose({
  clearSearch: () => {
    query.value = "";
    emit('clear');
  },
  setSearchQuery: (newQuery: string) => {
    query.value = newQuery;
  },
  getRecentSearches,
  clearRecentSearches,
  handleSearch
});
</script>

<style scoped>
.search-box {
  width: 60%;
  display: flex;
  justify-content: space-between;
  background: #C9B59C;
  padding: 10px 18px;
  border-radius: 28px;
  margin: 22px auto;
}
input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
}
.icon {
  font-size: 20px;
  cursor: pointer;
}
</style>
