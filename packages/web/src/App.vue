<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
</script>

<style scoped>
:deep(.bg-grey-50) {
  background-color: #f5f5f5;
}

.tabs-container {
  position: relative !important;
  z-index: 50 !important;
}

.tab-button {
  font-weight: 500;
  padding-right: 40px;
}

.kpi-sticky {
  position: sticky;
  top: 60px;
  z-index: 100;
  background-color: #f5f5f5;
  padding: 16px 16px;
  margin: -32px -16px 32px -16px;
  border-bottom: 4px solid #019eab;
}

.kpi-title {
  color: #019eab;
}
</style>
