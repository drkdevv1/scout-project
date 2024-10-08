<script>
export default {
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    searchProduct() {
      this.$emit('search', this.searchQuery);
    },
  },
};
</script>


<template>
  <!-- Contenedor del buscador con margen y centrado -->
  <div class="max-w-lg mx-auto my-6">
    <div class="flex items-center border rounded-full p-2 bg-gray-100">
      <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchProduct"
          placeholder="Search"
          class="flex-grow bg-transparent focus:outline-none px-4 text-gray-600"
      />
      <button
          @click="searchProduct"
          class="text-gray-400 hover:text-gray-600 focus:outline-none px-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.35-1.35L21 21z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>