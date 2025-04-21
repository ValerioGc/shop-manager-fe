// src/meta/productMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const productMeta: RouteMeta = {
    title: 'Product Details',
    titolo: 'Dettagli del Prodotto',
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
                ita: 'dettagli, prodotto',
                eng: 'details, product',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Dettagli del Prodotto | Shop Name',
                eng: 'Product Details | Shop Name',
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
            content: 'https://www.shop-name.com/name/product/detail/:id',
        },
    ],
};
