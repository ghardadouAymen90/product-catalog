import { ref, Ref, reactive, onMounted } from 'vue';
import { apiService } from '../services/api';
import type { KPIData } from '../types/index';

interface UseKPIReturn {
  loading: Ref<boolean>;
  kpi: Ref<KPIData>;
  fetchKPI: () => Promise<void>;
}

export function useKPI(): UseKPIReturn {
  const loading = ref(false);
  const kpi = ref<KPIData>({
    totalProducts: 0,
    totalReviews: 0,
    totalAuthors: 0,
  });

  const fetchKPI = async () => {
    loading.value = true;
    try {
      kpi.value = await apiService.getKPI();
    } catch (error) {
      console.error('Failed to load KPI:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchKPI);

  return { loading, kpi, fetchKPI };
}
