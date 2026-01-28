
import { createRouter, createWebHistory } from "vue-router";
import PageNotFound from '../views/Page-Not-Found.vue'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Cart from '../views/Cart.vue'
import Contact from '../views/Contact.vue'
import PrivacyPolicy from '../views/Privacy-Policy.vue'
import TermsConditions from '../views/Terms-Conditions.vue'
import SignIn from '../views/Sign-in.vue'
import ViewProduct from '../views/View-Product.vue'
import Checkout from '../views/Checkout.vue'
import OrderDetails from '../views/OrderDetails.vue'
import Profile from '../views/Profile.vue'
import PaymentVerification from '../views/Payment-Verification.vue'


import { useUserStore } from '@/stores/user'
import { useInteractiveStore } from '@/stores/interactive'

const router = createRouter({

history: createWebHistory(process.env.BASE_URL),

routes: [
 
  {
    path: "/:catchAll(.*)",
    name: "PageNotFound",
    component: PageNotFound,
    meta: {
      title: 'Page Not Found'
    }
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Home - Tech By Cas"
    }
  },
  {
    path: "/shop",
    name: "shop",
    component: Shop,
    meta: {
      title: "Shop - Tech By Cas"
    }
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
    meta: {
      title: "Cart - Tech By Cas"
    }
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
    meta: {
      title: "Contact us - Tech By Cas"
    }
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: PrivacyPolicy,
    meta: {
      title: "Privacy and Policy - Tech By Cas"
    }
  },
  {
    path: "/terms-conditions",
    name: "terms-conditions",
    component: TermsConditions,
    meta: {
      title: "Terms and Conditions - Tech By Cas"
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
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn,
    meta: {
      title: "Sign in or Sign up - Tech By Cas"
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/Forgot-Password.vue'),
    meta: {
      title: 'Reset Your Password - Tech By Cas'
    }
  },
  {
    path: '/new-password/:id',
    name: 'new-password',
    component: () => import('../views/New-Password.vue'),
    meta: {
      title: 'Create New Password - Tech By Cas'
    }
  },
  {
    path: "/view-product/:item",
    name: "view-product",
    component: ViewProduct,
    meta: {
      title: "View Product - Tech By Cas"
    }
  },

  //DASHBOARD PAGES

  {
    path: '/account/checkout',
    name: 'checkout',
    component: Checkout,
    meta: {
      title: 'Checkout - Tech By Cas',
      requiresAuth: true
    }
  },
  {
    path: '/account/profile',
    name: 'profile',
    component: Profile,
    meta: {
      title: 'My profile - Tech By Cas',
      requiresAuth: true
    }
  },
  {
    path: '/account/order-details/:order_id',
    name: 'order-details',
    component: OrderDetails,
    meta: {
      title: 'My Order - Tech By Cas',
      requiresAuth: true
    }
  },  
  {
    path: '/account/payment-verification',
    name: 'payment-verification',
    component: PaymentVerification,
    meta: {
      title: 'Payment Verification - Tech By Cas',
      requiresAuth: true
    }
  }
],

scrollBehavior(to, from, savedPosition) {
   
  return { top: 0 }; // Scroll to the top
  
}

})


router.beforeEach(async (to, from, next) => {
  const user_store = useUserStore();
  const interactive_store = useInteractiveStore();

  document.title = to.meta.title || 'Tech By Cas | You Order, We Deliver.';

  // Wait for fetch if not done
  if (!user_store.isFetched) {
    await user_store.fetch_user().catch(() => {}); // ignore errors
  }

  // Redirect unauthenticated users from protected pages
  if (to.meta.requiresAuth && !user_store.isAuthenticated) {
    interactive_store.set_page_to_go(to.name);
    return next({ name: "sign-in" });
  }

  // Redirect authenticated users away from guest-only pages (like sign-in)
  if (user_store.isAuthenticated && to.name === 'sign-in') {
    return next({ name: 'home' }); // change 'home' to your home route name
  }

  next();
});



export default router;
