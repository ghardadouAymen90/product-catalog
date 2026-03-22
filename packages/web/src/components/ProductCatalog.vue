<template>
  <div>
    <div v-if="loading" class="text-center pa-12">
      <v-progress-circular indeterminate color="#019eab" size="48"></v-progress-circular>
      <p class="text-grey-600 mt-4">Loading all {{ totalProducts }} products...</p>
    </div>

    <div v-else-if="products.length === 0" class="pa-8 text-center">
      <v-card class="pa-8 bg-grey-50">
        <v-icon size="64" color="text-grey-400" class="mb-4">mdi-inbox-outline</v-icon>
        <p class="text-grey-600">No products found</p>
      </v-card>
    </div>

    <v-card v-else class="elevation-3">
      <div
        style="
          background: linear-gradient(135deg, #019eab 0%, #00897b 100%);
          color: white;
          padding: 20px;
        "
        class="d-flex justify-space-between align-center"
      >
        <div>
          <h3 class="text-h6 font-weight-bold">Product Inventory</h3>
          <p class="text-caption mt-1 mb-0">
            Showing {{ startIndex + 1 }} - {{ endIndex }} of {{ totalProducts }} products
          </p>
        </div>
        <v-icon size="40">mdi-package-multiple</v-icon>
      </div>

      <v-table class="text-body-2" density="compact">
        <thead>
          <tr style="background-color: #f5fafb; border-bottom: 2px solid #019eab;">
            <th class="text-left font-weight-bold" style="color: #019eab; padding: 16px;">
              Reference
            </th>
            <th class="text-left font-weight-bold" style="color: #019eab; padding: 16px;">
              Product Name
            </th>
            <th class="text-center font-weight-bold" style="color: #019eab; padding: 16px;">
              Price
            </th>
            <th class="text-center font-weight-bold" style="color: #019eab; padding: 16px;">
              Stock Level
            </th>
            <th class="text-center font-weight-bold" style="color: #019eab; padding: 16px;">
              Reviews
            </th>
            <th class="text-center font-weight-bold" style="color: #019eab; padding: 16px;">
              Avg Rating
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in paginatedProducts"
            :key="product.id"
            :style="{
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
              borderBottom: '1px solid #e0e0e0',
              transition: 'background-color 0.2s',
              cursor: 'pointer'
            }"
            @mouseenter="(e: Event) => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f0fafb'"
            @mouseleave="(e: Event) => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb'"
          >

            <td class="text-left px-4 py-3">
              <v-chip
                size="small"
                variant="outlined"
                color="#019eab"
                :text="product.reference"
                class="font-weight-bold"
              ></v-chip>
            </td>

            <td class="text-left px-4 py-3" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="product.name">
              <span class="font-weight-medium">{{ product.name }}</span>
            </td>

            <td class="text-center px-4 py-3">
              <span class="font-weight-bold" style="color: #00897b; font-size: 16px;">
                €{{ product.price.toFixed(2) }}
              </span>
            </td>

            <td class="text-center px-4 py-3">
              <div class="d-flex flex-column align-center ga-1">
                <v-chip
                  :color="
                    product.stock > 100
                      ? '#00897b'
                      : product.stock > 10
                        ? '#ff9800'
                        : '#d32f2f'
                  "
                  size="small"
                  text-color="white"
                  class="font-weight-bold"
                >
                  {{ product.stock }}
                </v-chip>
              </div>
            </td>

            <td class="text-center px-4 py-3">
              <v-badge
                :content="product.reviews?.length || 0"
                color="#019eab"
                inline
              >
                <v-icon>mdi-comment-multiple-outline</v-icon>
              </v-badge>
            </td>

            <td class="text-center px-4 py-3">
              <div v-if="product.reviews && product.reviews.length > 0" class="d-flex align-center justify-center ga-1">
                <v-progress-circular
                  :value="(getAverageRating(product) / 5) * 100"
                  :color="getAverageRating(product) >= 4 ? '#00897b' : getAverageRating(product) >= 3 ? '#ff9800' : '#d32f2f'"
                  size="28"
                  class="ml-1"
                >
                  <span class="text-caption font-weight-bold">
                    {{ getAverageRating(product).toFixed(1) }}
                  </span>
                </v-progress-circular>
              </div>
              <span v-else class="text-grey-500">No ratings</span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-card-text class="bg-grey-100 pa-6">
        <div class="d-flex justify-space-between align-center flex-wrap gap-3">
            <v-select
              v-model="itemsPerPage"
              :items="[10, 20, 50, 100]"
              variant="outlined"
              density="compact"
              label="Items per page"
              style="max-width: 120px"
            ></v-select>

          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            color="#019eab"
            active-color="#019eab"
          ></v-pagination>
        </div>
      </v-card-text>

      <v-card-text class="bg-grey-100 pa-4 border-t">
        <div class="d-flex justify-space-between align-center text-caption">
          <div>
            <strong>Total Products:</strong> {{ totalProducts }}
            <span class="text-grey-600 ml-2">|</span>
            <strong class="ml-2">Avg Price:</strong>
            €{{ getAveragePrice().toFixed(2) }}
          </div>
          <div>
            <strong>Total Stock:</strong> {{ getTotalStock() }}
            <span class="text-grey-600 ml-2">|</span>
            <strong class="ml-2">Total Reviews:</strong>
            {{ getTotalReviews() }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { apiService } from '../services/api';
import type { Product } from '../types/index';

const emit = defineEmits<{
  'product-count': [count: number];
}>();

const loading = ref(false);
const products = ref<Product[]>([]);
const totalProducts = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(20);

const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalProducts.value));

const paginatedProducts = computed(() => products.value);

watch(currentPage, () => {
  fetchProductsPage();
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchProductsPage();
});

const fetchProductsPage = async () => {
  loading.value = true;
  try {
    const response = await apiService.getProductsPage(currentPage.value, itemsPerPage.value);
    products.value = response.items;
    totalProducts.value = response.total || 0;
    emit('product-count', totalProducts.value);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const getAverageRating = (product: Product): number => {
  if (!product.reviews || product.reviews.length === 0) return 0;
  const sum = product.reviews.reduce((acc, r) => acc + r.notation, 0);
  return sum / product.reviews.length;
};

const getAveragePrice = (): number => {
  if (products.value.length === 0) return 0;
  const sum = products.value.reduce((acc, p) => acc + p.price, 0);
  return sum / products.value.length;
};

const getTotalStock = (): number => {
  return products.value.reduce((acc, p) => acc + p.stock, 0);
};

const getTotalReviews = (): number => {
  return products.value.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);
};

onMounted(async () => {
  await fetchProductsPage();
});
</script>
