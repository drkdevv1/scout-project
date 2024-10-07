<script>
export default {
  props: {
    product: Object,
  },
};
</script>

<template>
  <div class="card">
    <!-- Muestra la imagen del producto -->
    <img :src="product.imageUrl" alt="Imagen del producto" class="product-image" />

    <!-- Información del producto -->
    <h3>{{ product.name }}</h3>
    <p>Precio: {{ product.price }}</p>
    <p>{{ product.seller }}</p>

    <!-- Botón de Comprar que redirige al enlace del producto -->
    <a :href="product.link" class="buy-button" target="_blank">Comprar</a>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
  text-align: center; /* Centra el contenido */
}

.product-image {
  width: 100px; /* Tamaño de la imagen */
  height: auto;
  margin-bottom: 10px; /* Espacio entre la imagen y el texto */
}

.buy-button {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 15px;
  color: white;
  background-color: #da1e1e;
  border: none;
  border-radius: 4px;
  text-decoration: none; /* Elimina el subrayado */
}
.buy-button:hover {
  background-color: darkred; /* Cambia el color al pasar el mouse */
}
</style>
