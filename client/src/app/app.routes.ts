import { Routes } from '@angular/router';
import { TermsOfUse } from './features/policies/pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicy } from './features/policies/pages/privacy-policy/privacy-policy.component';
import { Home } from './features/products/pages/featured-products/featured-products.component';
import { Product } from './features/products/pages/product-detail/product-detail.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'terms-of-use', component: TermsOfUse },
    { path: 'product', component: Product },
    {
        path: 'profile',
        component: Product,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
    },
    {
        path: 'admin',
        component: Product,
        canActivate: [adminGuard]
    },
    { path: '', component: Home },
    { path: '**', redirectTo: '' }, // Wildcard route for a 404 page
];
