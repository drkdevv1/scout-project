<script>
import SearchBar from "@/components/SearchBar.vue";
import ProductList from "@/components/ProductList.vue";
import { ProductService } from './services/ProductService';

export default {
  components: {
    SearchBar,
    ProductList,
  },
  data() {
    return {
      products: [],
    };
  },
  methods: {
    async fetchProducts(searchQuery) {
      try {
        this.products = await ProductService.searchProducts(searchQuery);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },
};
</script>

<template>
  <div>
    <h1>scout-project</h1>
    <SearchBar @search="fetchProducts" />
    <ProductList :products="products" />
  </div>
</template>

<style scoped>

</style>
