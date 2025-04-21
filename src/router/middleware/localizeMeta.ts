// utils/localizeMeta.ts

import type { MetaTag } from '@/types/RouteMeta';

/**
 * Retu
 * @param metaTags Meta tag array for localization.
 * @param lang Desired language ('ita' or 'eng').
 * @returns Array of meta tags with resolved content.
 */
export function localizeMetaTags(metaTags: MetaTag[], lang: 'ita' | 'eng'): MetaTag[] {
    return metaTags.map((tag) => {
        if (typeof tag.content === 'object') {
            return {
                ...tag,
                content: tag.content[lang],
            };
        }
        return tag;
    });
}
