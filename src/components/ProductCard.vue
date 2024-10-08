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
</style>
