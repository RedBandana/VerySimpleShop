import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(
  selectProductState,
  (state) => state.products
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state) => state.selectedProduct
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectProductsTotal = createSelector(
  selectProductState,
  (state) => state.total
);

export const selectProductsPage = createSelector(
  selectProductState,
  (state) => state.page
);

export const selectProductsLimit = createSelector(
  selectProductState,
  (state) => state.limit
);

export const selectProductsTotalPages = createSelector(
  selectProductState,
  (state) => state.totalPages
);

export const selectProductsFilter = createSelector(
  selectProductState,
  (state) => state.filter
);

export const selectProductsPagination = createSelector(
  selectProductState,
  (state) => ({
    page: state.page,
    limit: state.limit,
    total: state.total,
    totalPages: state.totalPages
  })
);

export const selectProductById = (productId: string) =>
  createSelector(
    selectProducts,
    (products) => products.find(product => product._id === productId || product._id === productId)
  );

export const selectProductsByCollection = (collection: string) =>
  createSelector(
    selectProducts,
    (products) => products.filter(product => product.collections.includes(collection))
  );

export const selectProductsInPriceRange = (minPrice: number, maxPrice: number) =>
  createSelector(
    selectProducts,
    (products) => products.filter(product => product.price >= minPrice && product.price <= maxPrice)
  );

export const selectProductCollections = createSelector(
  selectProducts,
  (products) => {
    const collections = new Set<string>();
    products.forEach(product => {
      product.collections.forEach(collection => collections.add(collection));
    });
    return Array.from(collections).sort();
  }
);

export const selectProductsLoadingState = createSelector(
  selectProductsLoading,
  selectProductsError,
  (loading, error) => ({
    loading,
    error
  })
);