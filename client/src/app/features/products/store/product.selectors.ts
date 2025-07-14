import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectProductsPagination = createSelector(
  selectProductState,
  (state) => state.productsPagination
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state) => state.product
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectProductsFilter = createSelector(
  selectProductState,
  (state) => state.filter
);

export const selectProductById = (productId: string) =>
  createSelector(
    selectProductsPagination,
    (pagination) => pagination?.products.find(product => product._id === productId || product._id === productId)
  );

export const selectProductsByCollection = (collection: string) =>
  createSelector(
    selectProductsPagination,
    (pagination) => pagination?.products.filter(product => product.collections.includes(collection))
  );

export const selectProductsInPriceRange = (minPrice: number, maxPrice: number) =>
  createSelector(
    selectProductsPagination,
    (pagination) => pagination?.products.filter(product => product.price >= minPrice && product.price <= maxPrice)
  );

export const selectProductCollections = createSelector(
  selectProductsPagination,
  (pagination) => {
    const collections = new Set<string>();
    pagination?.products.forEach(product => {
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