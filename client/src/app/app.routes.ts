import { Routes } from '@angular/router';
import { TermsOfUse as TermsOfUsePage } from './features/policies/pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicy as PrivacyPolicyPage } from './features/policies/pages/privacy-policy/privacy-policy.component';
import { FeaturedProducts } from './features/products/pages/featured-products/featured-products.component';
import { ProductList as ProductListPage } from './features/products/pages/product-list/product-list.component';
import { ProductDetail as ProductDetailPage } from './features/products/pages/product-detail/product-detail.component';
import { ShoppingCart as ShoppingCartPage } from './features/carts/pages/shopping-cart/shopping-cart.component';
import { OrderDetail as OrderDetailPage } from './features/orders/pages/order-detail/order-detail.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent as LoginPage } from './features/auth/pages/login/login.component';
import { RegisterPage } from './features/auth/pages/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'privacy-policy', component: PrivacyPolicyPage },
    { path: 'terms-of-use', component: TermsOfUsePage },
    { path: 'products', component: ProductListPage, canActivate: [adminGuard], },
    { path: 'products/:id', component: ProductDetailPage, canActivate: [adminGuard], },
    { path: 'cart', component: ShoppingCartPage },
    { path: 'order-details', component: OrderDetailPage },
    {
        path: 'profile',
        component: ProductDetailPage,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
    },
    {
        path: 'admin',
        component: ProductDetailPage,
        canActivate: [adminGuard]
    },
    { path: '', component: FeaturedProducts },
    { path: '**', redirectTo: '' }, // Wildcard route for a 404 page
];
