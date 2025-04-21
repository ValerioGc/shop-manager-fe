// src/meta/contactMeta.ts

import type { RouteMeta } from '@/types/RouteMeta';

export const contactMeta: RouteMeta = {
    title: 'Contacts',
    titolo: 'Contatti',
    metatags: [
        {
            name: 'description',
            content: {
                ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contattaci per informazioni sui nostri prodotti.',
                eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contact us for information on our products.',
            },
        },
        {
            name: 'keywords',
            content: {
                ita: 'contatti, informazioni, prodotti',
                eng: 'contacts, information, products',
            },
        },
        {
            property: 'og:title',
            content: {
                ita: 'Contatti | Shop Name',
                eng: 'Contacts | Shop Name',
            },
        },
        {
            property: 'og:description',
            content: {
                ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contattaci per informazioni sui nostri prodotti.',
                eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contact us for information on our products.',
            },
        },
        {
            property: 'og:url',
            content: 'https://www.shop-name.com/name/contacts',
        },
    ],
};
