<script>
import ProductCard from "@/components/ProductCard.vue";

export default {
  components: {
    ProductCard,
  },
  props: {
    products: Array,
  },
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <ProductCard
          v-for="(product, index) in products"
          :key="index"
          :product="product"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
