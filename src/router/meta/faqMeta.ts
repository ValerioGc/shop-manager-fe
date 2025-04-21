// src/meta/faqMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const faqMeta: RouteMeta = {
    title: 'FAQ',
    titolo: 'FAQ',
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
                ita: 'FAQ, domande frequenti',
                eng: 'FAQ, frequently asked questions',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'FAQ | Shop Name',
                eng: 'FAQ | Shop Name',
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
            content: 'https://www.shop-name.com/name/faq',
        },
    ],
};
