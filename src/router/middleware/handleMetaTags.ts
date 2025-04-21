import { localizeMetaTags } from './localizeMeta';
import type { RouteMeta } from '@/types/RouteMeta';
import type { RouteLocationNormalized } from 'vue-router';

/**
 * Manages the meta tags of the page based on the route metadata and the language.
 * @param to RouteLocationNormalized
 */
export function handleMetaTags(to: RouteLocationNormalized): void {
    const language = localStorage.getItem('language') || 'ita';
    const lang: 'ita' | 'eng' = language === 'eng' ? 'eng' : 'ita';

    if (to.meta && (to.meta as RouteMeta).metatags) {
        const meta = to.meta as RouteMeta;

        const localizedMeta = meta.metatags ? localizeMetaTags(meta.metatags, lang) : [];

        localizedMeta.forEach((tag) => {
            const element =
                document.querySelector(`meta[name="${tag.name}"]`) ||
                document.querySelector(`meta[property="${tag.property}"]`) ||
                document.createElement('meta');

            if (tag.name) element.setAttribute('name', tag.name);
            else if (tag.property) element.setAttribute('property', tag.property);

            element.setAttribute('content', tag.content as string);
            document.head.appendChild(element);
        });
    }
}
