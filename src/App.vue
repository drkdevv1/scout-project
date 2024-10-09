<script>
import SearchBar from "@/components/SearchBar.vue";
import ProductList from "@/components/ProductList.vue";
import Paginator from "@/components/Paginator.vue";
import Spinner from "@/components/Spinner.vue";
import { ProductService } from './services/ProductService';

export default {
  components: {
    SearchBar,
    ProductList,
    Paginator,
    Spinner,
  },
  data() {
    return {
      products: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      message: '',
    };
  },
  methods: {
    async fetchProducts(searchQuery, page = 1) {
      this.isLoading = true;
      this.message = '';
      this.products = []; // Reiniciar productos antes de la carga

      try {
        const data = await ProductService.searchProducts(searchQuery, page);
        const fetchedProducts = data.products;

        // Ordenar los productos por precio
        fetchedProducts.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, "")); // Convertir a número
          const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
          return priceA - priceB;
        });

        // Mostrar los productos uno por uno
        for (const product of fetchedProducts) {
          this.products.push(product);
          await new Promise(resolve => setTimeout(resolve, 100)); // Esperar un poco antes de mostrar el siguiente producto
        }

        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;

        if (this.products.length === 0) {
          this.message = 'No se encontraron productos. Intenta con otra búsqueda.';
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.message = 'Error al cargar los productos. Por favor, intenta de nuevo.';
      } finally {
        this.isLoading = false;
      }
    },
    changePage(newPage) {
      this.fetchProducts(this.$refs.searchBar.searchQuery, newPage);
    },
  },
};
</script>

<template>
  <div class="text-center my-6">
    <h1 class="text-5xl font-bold font-poppins" style="color: #df0775;">Scout</h1>
    <SearchBar @search="fetchProducts" ref="searchBar"/>

    <div v-if="!isLoading && products.length === 0 && !message">
      <p style="color: #df0775;">Antes de buscar algo, ingresa un término en el buscador.</p>
    </div>

    <Spinner v-if="isLoading"/>

    <div v-if="message" style="color: #df0775;">
      <p>{{ message }}</p>
    </div>

    <ProductList v-if="!isLoading && products.length > 0" :products="products"/>

    <Paginator v-if="!isLoading && products.length > 0" :currentPage="currentPage" :totalPages="totalPages"
               @pageChanged="changePage"/>
  </div>
</template>

<style>
h1 {
  font-family: 'Poppins', sans-serif;
}
</style>