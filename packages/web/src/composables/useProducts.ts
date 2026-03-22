import { ref, Ref, onMounted } from 'vue';
import { apiService } from '../services/api';
import type { Product } from '../types/index';

interface UseProductsReturn {
  products: Ref<Product[]>;
  loading: Ref<boolean>;
  fetchProducts: () => Promise<void>;
}

export function useMostAppreciatedProducts(): UseProductsReturn {
  const products = ref<Product[]>([]);
  const loading = ref(false);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      products.value = await apiService.getMostAppreciatedProducts();
    } catch (error) {
      console.error('Failed to load most appreciated products:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchProducts);

  return { products, loading, fetchProducts };
}

export function useLowestRatedProducts(): UseProductsReturn {
  const products = ref<Product[]>([]);
  const loading = ref(false);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      products.value = await apiService.getLowestRatedProducts();
    } catch (error) {
      console.error('Failed to load lowest rated products:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchProducts);

  return { products, loading, fetchProducts };
}
