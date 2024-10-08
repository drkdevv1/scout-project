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
      isLoading: false, // Estado de carga
      message: '', // Mensaje a mostrar
    };
  },
  methods: {
    async fetchProducts(searchQuery) {
      this.isLoading = true; // Inicia el estado de carga
      this.message = ''; // Limpia el mensaje anterior
      try {
        this.products = await ProductService.searchProducts(searchQuery);
        if (this.products.length === 0) {
          this.message = 'No se encontraron productos. Intenta con otra búsqueda.'; // Mensaje si no hay productos
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.message = 'Error al cargar los productos. Por favor, intenta de nuevo.'; // Mensaje de error
      } finally {
        this.isLoading = false; // Finaliza el estado de carga
      }
    },
  },
};
</script>



<template>
  <div class="text-center my-6">
    <h1 class="text-5xl font-bold font-poppins" style="color: #df0775;">Scout</h1>
    <SearchBar @search="fetchProducts" />

    <!-- Mensaje antes de buscar -->
    <div v-if="!isLoading && products.length === 0 && !message">
      <p style="color: #df0775;">Antes de buscar algo, ingresa un término en el buscador.</p>
    </div>

    <!-- Spinner de carga -->
    <div v-if="isLoading" class="spinner"></div>

    <!-- Mensaje de error o no encontrado -->
    <div v-if="message" style="color: #df0775;">
      <p>{{ message }}</p>
    </div>

    <!-- Lista de productos -->
    <ProductList v-if="!isLoading && products.length > 0" :products="products" />
  </div>
</template>



<style scoped>
h1 {
  font-family: 'Poppins', sans-serif;
}
.spinner {
  border: 4px solid #f3f3f3; /* Color de fondo */
  border-top: 4px solid #df0775; /* Color del spinner */
  border-radius: 50%;
  width: 60px; /* Tamaño del spinner */
  height: 60px; /* Tamaño del spinner */
  animation: spin 1s linear infinite; /* Animación de rotación */
  margin: 20px auto; /* Centra el spinner */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
