import { Routes } from '@angular/router';
import { TermsOfUse } from './features/policies/pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicy } from './features/policies/pages/privacy-policy/privacy-policy.component';
import { FeaturedProducts } from './features/products/pages/featured-products/featured-products.component';
import { ProductList } from './features/products/pages/product-list/product-list.component';
import { ProductDetail } from './features/products/pages/product-detail/product-detail.component';
import { ShoppingCart } from './features/carts/pages/shopping-cart/shopping-cart.component';
import { CheckoutSuccess } from './features/orders/pages/checkout-success/checkout-success.component';
import { CheckoutFailure } from './features/orders/pages/checkout-failure/checkout-failure.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'terms-of-use', component: TermsOfUse },
    { path: 'products', component: ProductList },
    { path: 'product/:id', component: ProductDetail },
    { path: 'cart', component: ShoppingCart },
    { path: 'checkout-success', component: CheckoutSuccess },
    { path: 'checkout-failure', component: CheckoutFailure },
    {
        path: 'profile',
        component: ProductDetail,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
    },
    {
        path: 'admin',
        component: ProductDetail,
        canActivate: [adminGuard]
    },
    { path: '', component: FeaturedProducts },
    { path: '**', redirectTo: '' }, // Wildcard route for a 404 page
];
