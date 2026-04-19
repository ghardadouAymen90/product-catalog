<template>
  <v-app>
    <v-app-bar color="#019eab" dark app elevation="4" height="70">
      <v-app-bar-title class="text-h5 font-weight-bold ml-2">
        Product Catalog
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <router-link to="/">
        <v-btn variant="text" color="white" class="mr-2">
          <v-icon>mdi-home</v-icon>
          Back to Home
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main class="bg-grey-50">
      <v-container fluid class="py-12 px-4">
        <v-row justify="center" align="center" style="min-height: 500px;">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-card class="elevation-3 pa-12">
              <div class="mb-8">
                <v-icon size="120" color="#d32f2f" class="mb-6">
                  mdi-file-not-found
                </v-icon>
              </div>

              <h1 class="text-h2 font-weight-bold mb-4" style="color: #d32f2f;">
                404
              </h1>

              <h2 class="text-h4 font-weight-bold mb-6" style="color: #019eab;">
                Page Not Found
              </h2>

              <p class="text-body-1 text-grey-700 mb-8">
                Sorry, the page you're looking for doesn't exist or has been moved.
              </p>

              <v-divider class="my-8"></v-divider>

              <div class="mb-6">
                <p class="text-body-2 text-grey-600 mb-4">
                  Available routes:
                </p>
                <v-chip
                  v-for="route in availableRoutes"
                  :key="route.path"
                  class="ma-2"
                  color="#019eab"
                  text-color="white"
                  size="small"
                  as="router-link"
                  :to="route.path"
                >
                  {{ route.label }}
                </v-chip>
              </div>

              <router-link to="/" style="text-decoration: none;">
                <v-btn
                  size="large"
                  color="#019eab"
                  variant="elevated"
                  class="mt-4"
                >
                  <v-icon left>mdi-home</v-icon>
                  Back to Dashboard
                </v-btn>
              </router-link>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="bg-grey-900 text-white py-6 text-center">
      <p class="text-caption mb-0">
        Product Catalog Dashboard • © {{ new Date().getFullYear() }}
      </p>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
const availableRoutes = [
  { path: '/', label: 'Dashboard' },
];
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  text-decoration: none;
}
</style>
