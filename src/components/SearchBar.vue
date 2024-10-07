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
  <div>
    <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="searchProduct"
        placeholder="Buscar producto..."
    />
    <button @click="searchProduct">Buscar</button>
  </div>
</template>

<style scoped>

</style>