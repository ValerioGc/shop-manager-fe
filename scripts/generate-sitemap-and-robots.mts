import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

function loadEnv(mode: string): void {
    const envPath: string = join(process.cwd(), `.env.${mode}`);
    try {
        const envData: string = readFileSync(envPath, 'utf-8');
        const envVars: string[] = envData.split('\n');
        envVars.forEach((varLine: string) => {
            const [key, value] = varLine.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (error) {
        console.error(`Error loading ${envPath}:`, error);
    }
}

const mode: string = process.argv[2] || 'development';

loadEnv(mode);

const baseUrl: string = process.env.VITE_BASE_URL || '';

interface Route {
    path: string;
    changefreq?: string;
    priority?: number;
    lastmod?: string;
}

const routes: Route[] = [
    {
        path: '/home',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/products',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/faq',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/shows',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/contacts',
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/search/products',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0],
    },
];

const dynamicRoutes: Route[] = [
    { path: '/product/detail/{id}', priority: 0.8 },
    { path: '/shows/{id}', priority: 0.7 },
];

dynamicRoutes.forEach((route: Route) => {
    if (!routes.some((r: Route) => r.path === route.path)) {
        routes.push(route);
    }
});

const generateSitemap = (routes: Route[]): string => {
    let sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    routes.forEach((route: Route) => {
        sitemap += `  <url>
    <loc>${baseUrl}${route.path}</loc>\n`;

        if (route.changefreq) {
            sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
        }

        if (route.priority !== undefined) {
            sitemap += `    <priority>${route.priority}</priority>\n`;
        }

        if (route.lastmod) {
            sitemap += `    <lastmod>${route.lastmod}</lastmod>\n`;
        }

        sitemap += `  </url>\n`;
    });

    sitemap += '</urlset>';

    return sitemap;
};

const generateRobotsTxt = (sitemapUrl: string): string => {
    return `User-agent: *
Disallow: /admin/
Disallow: /login/
Allow: /

Sitemap: ${sitemapUrl}
`;
};

const sitemap: string = generateSitemap(routes);
writeFileSync(join('public', 'sitemap.xml'), sitemap);

const robotsTxt: string = generateRobotsTxt(`${baseUrl}/sitemap.xml`);
writeFileSync(join('public', 'robots.txt'), robotsTxt);

console.log('✔️  Sitemap and robots.txt generated successfully!');
