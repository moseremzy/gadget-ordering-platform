
import { createRouter, createWebHistory } from "vue-router";

import { useInteractiveStore } from '@/stores/interactive'
import { useAdminStore } from "@/stores/admin";

const router = createRouter({

history: createWebHistory(process.env.BASE_URL),

routes: [
  {
    path: "/",
    redirect: '/account/dashboard',
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
    meta: {
      title: "Create an Account - Tech By Cas Admin"
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Login - Tech By Cas Admin"
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/Forgot-Password.vue'),
    meta: {
      title: 'Reset Your Password - Tech By Cas Admin'
    }
  },
  {
    path: '/new-password/:id',
    name: 'new-password',
    component: () => import('../views/New-Password.vue'),
    meta: {
      title: 'Create New Password - Tech By Cas Admin'
    }
  },
  {
    path: '/email-activation',
    name: 'email-activation',
    component: () => import('../views/Email-Activation.vue'),
    meta: {
      title: 'Email Verification - Tech By Cas'
    }
  },
  {
    path: '/email-confirmation/:id',
    name: 'email-confirmation',
    component: () => import('../views/Email-Confirmation.vue'),
    meta: {
      title: 'Email Confirmation - Tech By Cas'
    }
  },

  //DASHBOARD PAGES
  {
    path: '/account/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: 'Dashboard - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/items',
    name: 'items',
    component: () => import('../views/Items.vue'),
    meta: {
      title: 'Menus - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/add-item',
    name: 'Add-Item',
    component: () => import('../views/Add-Item.vue'),
    meta: {
      title: 'Add Item - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/customers',
    name: 'Customers',
    component: () => import('../views/Customers.vue'),
    meta: {
      title: 'Customers - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: {
      title: 'Orders - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/analytics',
    name: 'Analytics',
    component: () => import('../views/Analytics.vue'),
    meta: {
      title: 'Analytics - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: 'Settings - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/view-order/:order_id',
    name: 'View-Order',
    component: () => import('../views/View-Order.vue'),
    meta: {
      title: 'View Order - Tech By Cas Admin',
      requiresAuth: true
    }
  },
  {
    path: '/account/edit-item/:item_id',
    name: 'edit-item',
    component: () => import('../views/Edit-Item.vue'),
    meta: {
      title: 'Edit Item - Tech By Cas Admin',
      requiresAuth: true
    }
  },
],

scrollBehavior(to, from, savedPosition) {
  
  if (to.name === 'dashboard') {
   
    return savedPosition || {};

  }

  return { top: 0 }; // Scroll to the top
  
}

})

router.beforeEach(async (to, from, next) => { // Used to Set Page Title
  
  const admin_store = useAdminStore();
  const interactive_store = useInteractiveStore();

  document.title = to.meta.title || 'Tech By Cas Admin | Admin Panel.';

   // Wait for fetch if not done
  if (!admin_store.isFetched) {
    await admin_store.fetch_admin().catch(() => {}); // ignore errors
  }

  // Route requires auth & admin is authenticated → allow
  if (to.meta.requiresAuth && admin_store.isAuthenticated) {
    return next();
  }

  // Route requires auth & admin NOT authenticated → go to login
  if (to.meta.requiresAuth && !admin_store.isAuthenticated) {
    return next({ name: "login" });
  }

  // Route does NOT require auth & admin IS authenticated → go to dashboard
  if (!to.meta.requiresAuth && admin_store.isAuthenticated) {
    return next({ name: "dashboard" });
  } 
   
  next();

})



router.afterEach((to, from, next) => { // use am close sidebar after each page navigation on mobile sha
  
  const interactive_store = useInteractiveStore()

  if (window.innerWidth < 992) {

  interactive_store.Close_Sidebar()

  }

  next();

})


 
export default router;
