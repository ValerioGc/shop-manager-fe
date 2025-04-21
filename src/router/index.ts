import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import type { NavigationGuardNext } from 'vue-router';

import HomeView from '@/views/HomeView.vue';

// ***************************** MIDDLEWARE *****************************
import { handleLanguage } from '@/router/middleware/handleLanguage';
import { handleMetaTags } from '@/router/middleware/handleMetaTags';
import { resetBreadcrumbs } from './middleware/resetBreadcrumbs';
// ***************************** META *****************************
import { productListMeta } from '@/router/meta/productListMeta';
import { productMeta } from '@/router/meta/productMeta';
import { homeMeta } from '@/router/meta/homeMeta';
import { faqMeta } from '@/router/meta/faqMeta';
import { contactMeta } from '@/router/meta/contactMeta';
import { showListMeta } from '@/router/meta/showListMeta';
import { showMeta } from '@/router/meta/showMeta';
import { searchMeta } from '@/router/meta/searchMeta';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // ***************************** Maintenance page *****************************
        {
            path: '/:pathMatch(.*)*',
            redirect: '/name/home',
        },
        {
            path: '/',
            redirect: '/name/home',
        },
        // ***************************** HOME *****************************
        {
            path: '/name/home',
            name: 'home',
            component: HomeView,
            meta: homeMeta,
        },
        // ***************************** PRODUCTS *****************************
        {
            path: '/name/products',
            name: 'products',
            component: () => import('@/views/product/ProductsView.vue'),
            meta: productListMeta,
        },
        // ***************************** PRODUCT DETAILS *****************************
        {
            path: '/name/product/detail/:id',
            name: 'product-details',
            component: () => import('@/views/product/ProductDetailsView.vue'),
            meta: productMeta,
            props: (route) => ({
                id: route.params.id,
                name: route.params.name,
            }),
        },
        // ***************************** FAQS *****************************
        {
            path: '/name/faq',
            name: 'faq',
            component: () => import('@/views/FaqView.vue'),
            meta: faqMeta,
        },
        // ***************************** CONTACTS *****************************
        {
            path: '/name/contacts',
            name: 'contacts',
            component: () => import('@/views/ContactView.vue'),
            meta: contactMeta,
        },
        // ***************************** SEARCH *****************************
        {
            path: '/name/search/products',
            name: 'search',
            component: () => import('@/views/product/SearchView.vue'),
            props: (route) => ({ query: route.query.text }),
            meta: searchMeta,
        },
        // ***************************** SHOW DETAILS *****************************
        {
            path: '/name/shows/:id',
            name: 'showDetails',
            component: () => import('@/views/show/ShowDetailsView.vue'),
            meta: showMeta,
            props: (route) => ({
                id: route.params.id,
                name: route.params.name,
            }),
        },
        // ***************************** SHOWS *****************************
        {
            path: '/name/shows',
            name: 'shows',
            component: () => import('@/views/show/ShowView.vue'),
            meta: showListMeta,
        },
    ],
    scrollBehavior(to, from) {
        if (
            (to.name === 'home' && from.name === 'home') ||
            (to.name === 'shows' && from.name === 'shows')
        )
            return;
        else return { top: 0 };
    },
});

router.beforeEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        handleLanguage(to);
        handleMetaTags(to);
        resetBreadcrumbs(to, from);
        next();
    },
);

export default router;
