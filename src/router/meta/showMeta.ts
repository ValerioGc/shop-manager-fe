// src/meta/showMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const showMeta: RouteMeta = {
    title: 'Show Details',
    titolo: 'Dettaglio Fiera',
    metatags: [
        {
            name: 'description',
            content: {
                ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli',
                eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            },
        },
        {
            name: 'keywords',
            content: {
                ita: 'website, show, event',
                eng: 'website, show, event',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Dettaglio Fiera | Shop Name',
                eng: 'Show Details | Shop Name',
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
            content: 'https://www.shop-name.com/name/shows',
        },
    ],
};
