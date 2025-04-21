// src/meta/searchMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const searchMeta: RouteMeta = {
    title: 'Search',
    titolo: 'Ricerca',
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
                ita: 'ricerca, ricerca prodotti',
                eng: 'search, product search',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Ricerca | Shop Name',
                eng: 'Search | Shop Name',
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
            content: 'https://www.shop-name.com/name/search',
        },
    ],
};
