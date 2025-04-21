// src/meta/homeMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

/**
 * Metadata for the Home page.
 */
export const homeMeta: RouteMeta = {
    title: 'Home',
    titolo: 'Home',
    metatags: [
        {
            name: 'description',
            content: {
                ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            },
        },
        {
            name: 'keywords',
            content: {
                ita: 'prodotti, fiere',
                eng: 'products, exhibitions',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Home | Shop Name',
                eng: 'Home | Shop Name',
            },
        },
        {
            name: 'og:description',
            content: {
                ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            },
        },
        {
            property: 'og:url',
            content: 'https://www.shop-name.com/name/home',
        },
    ],
};
