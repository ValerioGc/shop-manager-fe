import type { RouteMeta } from '@/types/RouteMeta';
import type { RouteLocationNormalized } from 'vue-router';

/**
 * Manages the language of the page based on the route metadata.
 * change the page title, the lang attribute of the <html> tag and the content of the meta tag "language".
 * @param to RouteLocationNormalized
 */
export function handleLanguage(to: RouteLocationNormalized): void {
    const language = localStorage.getItem('language') || 'ita';
    localStorage.setItem('language', language);

    // Page title
    if (to.meta && (to.meta as RouteMeta).title) {
        const meta = to.meta as RouteMeta;
        document.title = (language === 'eng' ? meta.title : meta.titolo) + ' | Shop Name';
    } else if (to.params.name) {
        document.title = `${to.params.name} | Shop Name`;
    } else {
        document.title = 'Shop Name';
    }

    // tag <html> lang
    document.documentElement.setAttribute('lang', language === 'eng' ? 'en' : 'it');

    // tag <meta name="language" content="it">
    let languageMetaTag = document.querySelector('meta[name="language"]');
    if (languageMetaTag) {
        languageMetaTag.setAttribute('content', language === 'eng' ? 'en' : 'it');
    } else {
        languageMetaTag = document.createElement('meta');
        languageMetaTag.setAttribute('name', 'language');
        languageMetaTag.setAttribute('content', language === 'eng' ? 'en' : 'it');
        document.head.appendChild(languageMetaTag);
    }
}
