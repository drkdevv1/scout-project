<script>
export default {
  props: {
    product: Object,
  },
};
</script>

<template>
  <a
      :href="product.link"
      target="_blank"
      class="product-card"
  >
    <img
        :src="product.imageUrl"
        alt="Imagen del producto"
        class="w-full h-auto mb-4 rounded-lg"
    />
    <p class="text-sm text-gray-500 mb-1">{{ product.seller }}</p>
    <h3 class="text-lg font-semibold text-white mb-2 truncate">{{ product.name }}</h3>
    <p class="text-xl font-bold" style="color: #df0775;">{{ product.price }}</p>
  </a>
</template>

<style scoped>
.product-card {
  display: inline-block; /* Para que se ajuste al contenido */
  transition: transform 0.3s ease; /* Suavizar la animación de la tarjeta */
}

.product-card:hover {
  transform: scale(1.05); /* Zoom al pasar el cursor sobre toda la tarjeta */
}
</style>
