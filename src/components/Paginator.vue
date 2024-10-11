<template>
  <div class="flex justify-center p-5">
    <div class="flex justify-center items-center space-x-2 bg-[#e7e6e8] rounded-lg shadow-lg" style="max-width: 400px; width: 100%; height: 50px">
      <!-- Botón de Anterior -->
      <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-3 py-2 rounded-full bg-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-400 transition"
      >
        &lt;
      </button>

      <!-- Páginas dinámicas con puntos suspensivos -->
      <div class="flex items-center">
        <span
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="['px-3 py-2 rounded-lg cursor-pointer transition-all duration-300', currentPage === page ? 'bg-[#df0775] text-white' : 'text-gray-600 hover:bg-gray-200']"
        >
          <!-- Mostrar puntos suspensivos si no es la primera o última página -->
          <span v-if="shouldShowEllipsis(page) && page !== currentPage">
            ...
          </span>
          <span v-else>{{ page }}</span>
        </span>
      </div>

      <!-- Botón de Siguiente -->
      <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="px-3 py-2 rounded-full bg-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-400 transition"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    changePage(newPage) {
      this.$emit("pageChanged", newPage);
    },
    shouldShowEllipsis(page) {
      // Mostrar puntos suspensivos para páginas no consecutivas
      return (
          (page > 1 && page < this.currentPage - 1) ||
          (page < this.totalPages && page > this.currentPage + 1)
      );
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados */
button {
  transition: background-color 0.3s ease-in-out;
}

button:disabled {
  cursor: not-allowed;
}

</style>
