import { Routes } from '@angular/router';
import { TermsOfUse } from './pages/policies/terms-of-use/terms-of-use';
import { PrivacyPolicy } from './pages/policies/privacy-policy/privacy-policy';
import { Home } from './pages/home/home';
import { Product } from './pages/product/product';

export const routes: Routes = [
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'terms-of-use', component: TermsOfUse },
    { path: 'product', component: Product },
    { path: '', component: Home },
    { path: '**', redirectTo: '' }, // Wildcard route for a 404 page
];
