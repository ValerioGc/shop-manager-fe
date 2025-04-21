import type { RouteLocationNormalized } from 'vue-router';

import { product_settings_store } from '@/stores/product_settings_store';

/**
 * Reset breadcrumbs when the user navigates to the products page.
 * @param to RouteLocationNormalized
 * @param from RouteLocationNormalized
 */
export function resetBreadcrumbs(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    if (to.name === 'products' && from.name !== 'products' && from.name !== 'product-details') {
        const store = product_settings_store();
        store.resetBreadcrumbs();
    }
}
