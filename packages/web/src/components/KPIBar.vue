<template>
  <v-row class="ga-4">
    <v-col cols="12" sm="4" md="2" v-for="metric in metrics" :key="metric.id">
      <v-card
        class="kpi-card h-100 pa-6 text-center elevation-3"
        :style="{ borderTop: `4px solid ${metric.color}` }"
      >
        <v-progress-circular
          v-if="loading"
          indeterminate
          :color="metric.color"
          class="mb-4"
        ></v-progress-circular>
        <template v-else>
          <div class="text-h3 font-weight-bold mb-2" :style="{ color: metric.color }">
            {{ metric.value }}
          </div>
          <div class="text-subtitle-2 font-weight-medium text-grey-700">
            {{ metric.label }}
          </div>
          <div class="text-caption text-grey-500 mt-3">
            {{ metric.icon }} {{ metric.description }}
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService } from '../services/api';
import type { KPIData } from '../types/index';

const loading = ref(false);
const kpi = ref<KPIData>({
  totalProducts: 0,
  totalReviews: 0,
  totalAuthors: 0,
});

const metrics = computed(() => [
  {
    id: 1,
    label: 'Total Products',
    value: kpi.value.totalProducts,
    color: '#019eab',
    icon: '📦',
    description: 'Active products in catalog',
  },
  {
    id: 2,
    label: 'Total Reviews',
    value: kpi.value.totalReviews,
    color: '#00897b',
    icon: '⭐',
    description: 'Customer feedback received',
  },
  {
    id: 3,
    label: 'Total Authors',
    value: kpi.value.totalAuthors,
    color: '#0097a7',
    icon: '👥',
    description: 'Reviewers in database',
  },
]);

onMounted(async () => {
  loading.value = true;
  try {
    kpi.value = await apiService.getKPI();
  } catch (error) {
    console.error('Failed to load KPI:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.kpi-card {
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(1, 158, 171, 0.15) !important;
}
</style>
