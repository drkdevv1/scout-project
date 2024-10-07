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
  <div>
    <ProductCard
        v-for="(product, index) in products"
        :key="index"
        :product="product"
    />
  </div>
</template>

<style scoped>

</style>