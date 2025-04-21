// src/types/RouteMeta.ts

/**
 * Represents a meta tag for a route.
 */
export interface MetaTag {
    name?: string;
    property?: string;
    content: string | Record<string, string>;
}

/**
 * Represents metadata for a route.
 */
export interface RouteMeta {
    title?: string;
    titolo?: string;
    metatags?: MetaTag[];
    [key: string]: unknown;
    [key: symbol]: unknown;
}
