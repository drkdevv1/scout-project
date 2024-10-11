<script setup>

</script>

<template>
  <div class="spinner"></div>
</template>

<style>
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>