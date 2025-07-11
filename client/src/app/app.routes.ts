import { Routes } from '@angular/router';
import { TermsOfUse } from './features/policies/pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicy } from './features/policies/pages/privacy-policy/privacy-policy.component';
import { FeaturedProducts } from './features/products/pages/featured-products/featured-products.component';
import { ProductDetail } from './features/products/pages/product-detail/product-detail.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'terms-of-use', component: TermsOfUse },
    { path: 'product/:id', component: ProductDetail },
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
