// src/meta/showListMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const showListMeta: RouteMeta = {
    title: 'Shows',
    titolo: 'Fiere',
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
                ita: 'show, exhibitions',
                eng: 'show, exhibitions',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Fiere | Shop Name',
                eng: 'Exhibitions | Shop Name',
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
            content: 'https://www.shop-name.com/store/shows',
        },
    ],
};
