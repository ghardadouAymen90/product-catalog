import { ref, Ref, computed, ComputedRef, onMounted } from 'vue';
import { apiService } from '../services/api';
import type { Product } from '../types/index';

interface UsePaginationReturn {
  products: Ref<Product[]>;
  currentPage: Ref<number>;
  itemsPerPage: Ref<number>;
  totalProducts: Ref<number>;
  loading: Ref<boolean>;
  totalPages: ComputedRef<number>;
  startIndex: ComputedRef<number>;
  endIndex: ComputedRef<number>;
  fetchPage: () => Promise<void>;
  getAverageRating: (product: Product) => number;
  getAveragePrice: () => number;
  getTotalStock: () => number;
  getTotalReviews: () => number;
}

export function usePagination(): UsePaginationReturn {
  const products = ref<Product[]>([]);
  const totalProducts = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(20);
  const loading = ref(false);

  const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value));
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
  const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalProducts.value));

  const fetchPage = async () => {
    loading.value = true;
    try {
      const response = await apiService.getProductsPage(currentPage.value, itemsPerPage.value);
      products.value = response.items;
      totalProducts.value = response.total || 0;
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

  onMounted(fetchPage);

  return {
    products,
    currentPage,
    itemsPerPage,
    totalProducts,
    loading,
    totalPages,
    startIndex,
    endIndex,
    fetchPage,
    getAverageRating,
    getAveragePrice,
    getTotalStock,
    getTotalReviews,
  };
}
