import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/homepage/homepage').then(m => m.HomepageComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./components/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
  {
    path: 'farmer',
    loadComponent: () => import('./components/farmer-layout/farmer-layout').then(m => m.FarmerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/farmer-dashboard/farmer-dashboard').then(m => m.FarmerDashboardComponent) },
      { path: 'publish-crop', loadComponent: () => import('./components/publish-crop/publish-crop').then(m => m.PublishCropComponent) },
      { path: 'crops', loadComponent: () => import('./components/my-crops/my-crops').then(m => m.MyCropsComponent), runGuardsAndResolvers: 'always' },
      { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.OrdersComponent), runGuardsAndResolvers: 'always' },
      { path: 'receipts', loadComponent: () => import('./components/receipts/receipts').then(m => m.ReceiptsComponent) },
      { path: 'ratings', loadComponent: () => import('./components/ratings/ratings').then(m => m.RatingsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent) }
    ]
  },
  {
    path: 'dealer',
    loadComponent: () => import('./components/dealer-layout/dealer-layout').then(m => m.DealerLayoutComponent),
    children: [
      { path: '', redirectTo: 'marketplace', pathMatch: 'full' },
      { path: 'marketplace', loadComponent: () => import('./components/marketplace/marketplace').then(m => m.MarketplaceComponent) },
      { path: 'cart', loadComponent: () => import('./components/cart/cart').then(m => m.CartComponent) },
      { path: 'dashboard', loadComponent: () => import('./components/dealer-dashboard/dealer-dashboard').then(m => m.DealerDashboardComponent) },
      { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.OrdersComponent), runGuardsAndResolvers: 'always' },
      { path: 'payment', loadComponent: () => import('./components/payment/payment').then(m => m.PaymentComponent) },
      { path: 'invoices', loadComponent: () => import('./components/invoices/invoices').then(m => m.InvoicesComponent) },
      { path: 'ratings', loadComponent: () => import('./components/ratings/ratings').then(m => m.RatingsComponent) },
      { path: 'subscriptions', loadComponent: () => import('./components/subscriptions/subscriptions').then(m => m.SubscriptionsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent) }
    ]
  },
  { path: 'farmer-dashboard', redirectTo: '/farmer/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'farmers', loadComponent: () => import('./components/manage-farmers/manage-farmers').then(m => m.ManageFarmersComponent) },
      { path: 'dealers', loadComponent: () => import('./components/manage-dealers/manage-dealers').then(m => m.ManageDealersComponent) },
      { path: 'reports', loadComponent: () => import('./components/reports/reports').then(m => m.ReportsComponent) }
    ]
  }
];
