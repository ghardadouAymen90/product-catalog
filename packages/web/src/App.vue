<template>
  <v-app>
    <v-app-bar color="#019eab" dark app elevation="4" height="70">
      <v-app-bar-title class="text-h5 font-weight-bold ml-2">
        Product Catalog
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-50">
      <v-container fluid class="py-8 px-4">
        <section class="mb-12">
          <v-divider class="mb-6"></v-divider>
          <h2 class="text-h4 font-weight-bold mb-4" style="color: #019eab;">
            Key Performance Indicators
          </h2>
          <KPIBar />
        </section>


        <section class="mb-12">
          <v-divider class="mb-6"></v-divider>
          <h2 class="text-h4 font-weight-bold mb-3" style="color: #019eab;">
            Most Appreciated Products
          </h2>
          <p class="text-body-2 text-grey-700 mb-3">
            Top 5 products with the highest number of positive reviews (rating > 3)
          </p>
          <MostAppreciatedProducts />
        </section>

        <section class="mb-12">
          <v-divider class="mb-6"></v-divider>
          <h2 class="text-h4 font-weight-bold mb-3" style="color: #019eab;">
            Products Needing Attention
          </h2>
          <p class="text-body-2 text-grey-700 mb-3">
            Top 5 products with the lowest average ratings (below 3.0)
          </p>
          <LowestRatedProducts />
        </section>

        <section class="mb-12">
          <v-divider class="mb-6"></v-divider>
          <h2 class="text-h4 font-weight-bold mb-3" style="color: #019eab;">
            Complete Product Catalog
          </h2>
          <p class="text-body-2 text-grey-700 mb-3">
            Browse all {{ catalogCount }} products in the inventory
          </p>
          <ProductCatalog @product-count="catalogCount = $event" />
        </section>

        <v-divider class="my-8"></v-divider>
        <div class="text-center py-6">
          <p class="text-caption text-grey-600">
            <v-icon small>mdi-shield-check</v-icon>
            Product Catalog Dashboard • DEMO
          </p>
          <p class="text-caption text-grey-500 mt-2">
            © {{ new Date().getFullYear() }}
          </p>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';

const KPIBar = defineAsyncComponent(() => import('./components/KPIBar.vue'));
const MostAppreciatedProducts = defineAsyncComponent(() => import('./components/MostAppreciatedProducts.vue'));
const LowestRatedProducts = defineAsyncComponent(() => import('./components/LowestRatedProducts.vue'));
const ProductCatalog = defineAsyncComponent(() => import('./components/ProductCatalog.vue'));

const catalogCount = ref(0);
</script>

<style scoped>
:deep(.bg-grey-50) {
  background-color: #f5f5f5;
}
</style>
