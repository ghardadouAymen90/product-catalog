<template>
  <v-row class="4">
    <v-col
      v-for="product in products"
      :key="product.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card
        class="product-card h-100 elevation-2 transition-all"
        :class="{ 'elevation-8': hovered === product.id }"
      >
        <div
          class="pa-4"
          style="
            background: linear-gradient(135deg, #019eab 0%, #00897b 100%);
            color: white;
          "
        >
          <div class="d-flex justify-space-between align-center">
            <span class="text-h8">{{ '⭐'.repeat(getPositiveReviewCount(product)) }}</span>
            <v-chip
              size="small"
              color="white"
              text-color="#019eab"
              label
              class="font-weight-bold"
            >
              {{ getPositiveReviewCount(product) }} / 5
            </v-chip>
          </div>
          <h3 class="text-subtitle-1 font-weight-bold mt-3 text-truncate">
            {{ product.name }}
          </h3>
          <p class="text-caption mt-1 mb-0">Ref: {{ product.reference }}</p>
        </div>

        <v-card-text class="pa-4">
          <div class="mb-4">
            <div class="text-h5 font-weight-bold" style="color: #019eab;">
              €{{ product.price.toFixed(2) }}
            </div>
            <div class="text-caption text-grey-600">Price</div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="mb-3">
            <div class="text-body-2 text-grey-700">
              <strong>{{ product.stock }}</strong> in stock
            </div>
            <v-progress-linear
              :value="Math.min(product.stock, 100)"
              color="#019eab"
              height="4"
              class="mt-2"
            ></v-progress-linear>
          </div>

          <div>
            <div class="text-caption text-grey-600">
              {{ product.reviews?.length || 0 }} reviews
            </div>
          </div>
        </v-card-text>

      </v-card>
    </v-col>

    <v-col cols="12" v-if="products.length === 0 && !loading">
      <v-card class="pa-8 text-center bg-grey-50">
        <v-icon size="48" color="text-grey-400" class="mb-4"
          >mdi-inbox-outline</v-icon
        >
        <p class="text-grey-600">No appreciated products found</p>
      </v-card>
    </v-col>

    <v-col cols="12" v-if="loading">
      <div class="text-center pa-8">
        <v-progress-circular indeterminate color="#019eab"></v-progress-circular>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../services/api';
import type { Product } from '../types/index';

const loading = ref(false);
const products = ref<Product[]>([]);
const hovered = ref<number | null>(null);

const getPositiveReviewCount = (product: Product): number => {
  if (!product.reviews) return 0;
  return product.reviews.filter((r) => r.notation > 3).length;
};

onMounted(async () => {
  loading.value = true;
  try {
    products.value = await apiService.getMostAppreciatedProducts();
  } catch (error) {
    console.error('Failed to load most appreciated products:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-8px);
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}
</style>
