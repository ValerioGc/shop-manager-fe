// src/meta/productListMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const productListMeta: RouteMeta = {
    title: 'Products',
    titolo: 'Prodotti',
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
                ita: 'prodotti',
                eng: 'products',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Prodotti | Shop Name Store',
                eng: 'Products | Shop Name Store',
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
            content: 'https://www.shop-name.com/name/products',
        },
    ],
};
