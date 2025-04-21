/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';

import axios from '@/axios_config';
import type { ShowCarousel } from '@/types/entity/ShowCarousel';
import type { ShowList } from '@/types/entity/ShowList';
import type { ProductsList } from '@/types/entity/ProductsList';
import type { Product } from '@/types/entity/Product';
import type { Faq } from '@/types/entity/Faq';
import type { Contact } from '@/types/entity/Contact';
import type { Category } from '@/types/entity/Category';

interface ConfigState {
    pagination: {
        homeProductPagePagination: number | null;
        productPagePagination: number | null;
        showPageOldPagination: number | null;
        searchProductPagination: number | null;
    };
    settings: {
        websiteMaintenance: boolean | null;
        showHomeBanner: boolean | null;
        enableShowBanner: boolean | null;
        bannerImg: string;
        showPageImg: string | null;
        showHomeTitle: boolean | null;
        showHomeShowSection: boolean | null;
    };
    titles: {
        homeTitleText: { ita: string; eng: string };
        faqPageTitle: { ita: string; eng: string };
        showPageTitle: { ita: string; eng: string };
        contactPageTitle: { ita: string; eng: string };
        searchPageTitle: { ita: string; eng: string };
        footerTitle: { ita: string; eng: string };
    };
    text: {
        homePageDescriptionText: { ita: string; eng: string };
        contactPageText: { ita: string; eng: string };
        homePageShowsText: { ita: string; eng: string };
        showsPageText: { ita: string; eng: string };
        showOldPageText: { ita: string; eng: string };
        showNextPageText: { ita: string; eng: string };
        footerText: { ita: string; eng: string };
    };
}

interface CachedLists {
    latest: {
        total: number;
        _pages: Record<string, ProductsList[]>;
    };
    show_new: ShowCarousel[];
    show_old: {
        total: number;
        _pages: Record<string, ShowList[]>;
    };
    product_detail: Record<string, Product>;
    search: {
        last_query: any;
        total: number;
        _pages: Record<string, ProductsList[]>;
    };
    categories: Category[];
    faqs: Faq[] | [];
    contacts: Contact[] | [];
}

interface RouteItem {
    route: string;
    name: string;
    label: string;
}

interface APIStatuses {
    home: string;
    categories: string;
    products: string;
    product_detail: string;
    faqs: string;
    contacts: string;
    search: string;
    showO: string;
    showN: string;
    show: string;
}

interface GlobalStoreState {
    console_logging: boolean;
    console_debug: boolean;
    config: ConfigState;
    routes: RouteItem[];
    _host: string;
    _endpoint_prefix: string;
    api_status: string;
    api_statuses: APIStatuses;
    api_contact_status: string;
    cached: CachedLists;
    quick_contacts_list: any[];
    language: string;
    controllers: Record<string, AbortController>;
}

export const global_store = defineStore('global_store', {
    state: (): GlobalStoreState => ({
        // *************** <SETTINGS> ***************
        console_logging: false,
        console_debug: true,
        // *************** <CONFIG> ***************
        config: {
            // ********** Pagination **********
            pagination: {
                homeProductPagePagination: null,
                productPagePagination: null,
                showPageOldPagination: null,
                searchProductPagination: null,
            },
            // ********** Settings **********
            settings: {
                websiteMaintenance: null,
                showHomeBanner: null,
                enableShowBanner: null,
                bannerImg: '',
                showPageImg: '',
                showHomeTitle: null,
                showHomeShowSection: null,
            },
            titles: {
                homeTitleText: {
                    ita: '',
                    eng: '',
                },
                faqPageTitle: {
                    ita: '',
                    eng: '',
                },
                showPageTitle: {
                    ita: '',
                    eng: '',
                },
                contactPageTitle: {
                    ita: '',
                    eng: '',
                },
                searchPageTitle: {
                    ita: '',
                    eng: '',
                },
                footerTitle: {
                    ita: '',
                    eng: '',
                },
            },
            // ********** Texts **********
            text: {
                homePageDescriptionText: {
                    ita: '',
                    eng: '',
                },
                contactPageText: {
                    ita: '',
                    eng: '',
                },
                homePageShowsText: {
                    ita: '',
                    eng: '',
                },
                showsPageText: {
                    ita: '',
                    eng: '',
                },
                showOldPageText: {
                    ita: '',
                    eng: '',
                },
                showNextPageText: {
                    ita: '',
                    eng: '',
                },
                footerText: {
                    ita: '',
                    eng: '',
                },
            },
        },
        routes: [
            { route: '/name/home', name: 'Home', label: 'Home' },
            { route: '/name/products', name: 'Prodotti', label: 'Products' },
            { route: '/name/shows', name: 'Fiere', label: 'Shows' },
            { route: '/name/faq', name: 'FAQ', label: 'FAQ' },
            { route: '/name/contacts', name: 'Contatti', label: 'Contacts' },
        ],
        // *************** <API> ***************
        _host: String(import.meta.env.VITE_API_ENDPOINT),
        _endpoint_prefix: '/api/public',
        // *************** <API Status> ***************
        api_status: 'success',
        api_statuses: {
            home: 'success',
            categories: 'success',
            products: 'success',
            product_detail: 'success',
            faqs: 'success',
            contacts: 'success',
            search: 'success',
            showO: 'success',
            showN: 'success',
            show: 'success',
        },
        api_contact_status: 'success',
        // *************** <Cached Lists> ***************
        cached: {
            latest: {
                total: 0,
                _pages: {},
            },
            show_new: [],
            show_old: {
                total: 0,
                _pages: {},
            },
            product_detail: {},
            search: {
                last_query: null,
                total: 0,
                _pages: {},
            },
            categories: [],
            faqs: [],
            contacts: [],
        },
        /* *************** <SESSION> *************** */
        quick_contacts_list: sessionStorage.getItem('quick_contacts_list')
            ? JSON.parse(sessionStorage.getItem('quick_contacts_list')!)
            : [{}, {}, {}, {}],
        language: localStorage.getItem('language') || 'ita',
        // *************** <AbortControllers> ***************
        controllers: {},
    }),
    getters: {
        getLanguage(state): string {
            return state.language;
        },
    },
    actions: {
        // *************** Config ***************
        async loadConfig(): Promise<any> {
            const cachedConfig = sessionStorage.getItem('config');
            if (cachedConfig) {
                this.config = JSON.parse(cachedConfig);
                return 'success';
            } else {
                try {
                    const response = await fetch('/fe_config.json');
                    if (response.ok) {
                        const data = await response.json();
                        if (this.console_debug) console.log('Config loaded from file:', data);
                        if (this.console_debug) console.table(data);
                        this.config = data;
                        return 'success';
                    } else {
                        const api_response = await axios.get(
                            this._host + this._endpoint_prefix + '/config/read',
                        );
                        if (api_response.status === 503) {
                            if (this.console_debug) console.error('API in maintenance mode');
                            return 'maintenance';
                        }

                        if (this.console_debug) console.log('Config loaded from API:');
                        if (this.console_debug) console.table(api_response.data);

                        if (api_response.data) {
                            this.config = api_response.data;
                            sessionStorage.setItem('config', JSON.stringify(api_response.data));
                            return 'success';
                        } else {
                            return 'maintenance';
                        }
                    }
                } catch (error) {
                    if ((error as any).response && (error as any).response.status === 503) {
                        if (this.console_debug) console.error('API in maintenance mode');
                        return 'maintenance';
                    } else {
                        return 'error';
                    }
                }
            }
        },
        // *************** Settings ***************
        changeLanguage(): void {
            const metaLanguage = document.querySelector('meta[name="language"]');
            if (this.language === 'ita') {
                this.language = 'eng';
                document.documentElement.lang = 'en';
                metaLanguage?.setAttribute('content', 'en');
            } else {
                this.language = 'ita';
                document.documentElement.lang = 'it';
                metaLanguage?.setAttribute('content', 'it');
            }
            localStorage.setItem('language', this.language);
            if (this.console_debug)
                console.log('Lingua cambiata e salvata in localStorage:', this.language);
        },
        mountUrl(url: string): string {
            const parsedURL = url.split('/');
            const filename = parsedURL.pop() as string; // Remove last part of url
            const filenameParts = filename.split('.');
            const fileExtension = filenameParts.pop() as string;
            const fileNameOnly = filenameParts.join('.');
            if (fileExtension.toLowerCase() === 'svg') {
                parsedURL.push(filename);
                return parsedURL.join('/');
            }
            parsedURL.push('thumbnails'); // thumbnails folder
            const newFileName = `${fileNameOnly}_thumb.${fileExtension}`;
            parsedURL.push(newFileName);
            return parsedURL.join('/');
        },
        // *************** API ***************
        async apiDispatcher(uri: string, callName: string): Promise<any> {
            this.api_status = 'loading';
            const startTime = new Date().getTime();
            (this.api_statuses as any)[callName] = 'loading';

            const requestKey = `${callName}:${uri}`;

            // Cancel previous request if still pending
            if (this.controllers[requestKey]) {
                this.controllers[requestKey].abort();
            }

            const controller = new AbortController();
            this.controllers[requestKey] = controller;

            const url = this._host + this._endpoint_prefix + uri;
            if (this.console_debug) console.log('CALLING ENDPOINT: ', url);

            let response: any = null;
            try {
                response = await axios.get(url, { signal: controller.signal });
                if (this.console_debug) console.log(response);
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    if (this.console_debug) console.log('Request aborted:', error.message);
                } else {
                    if (this.console_debug) console.error('API error: ', error);
                    this.api_status = 'error';
                    (this.api_statuses as any)[callName] = 'error';
                    return { error: error.message };
                }
            }

            const status = await this.manageApiStatus(response, callName);
            if (this.console_logging) {
                const endTime = new Date().getTime();
                console.log(
                    `Final log:  ${new Date().toLocaleString()} | ${callName} ${url} | Response received in ${endTime - startTime}ms | Status: ${status}`,
                );
            }
            return response ? response.data : null;
        },
        async manageApiStatus(response: any, callName: string): Promise<string> {
            let statusMessage = '';
            if (
                response &&
                response.status === 200 &&
                response.data &&
                response.data.length === 0 &&
                response.data &&
                response.data.data.length === 0
            ) {
                (this.api_statuses as any)[callName] = 'empty';
                this.api_status = 'empty';
                statusMessage = 'Status: empty';
            } else if (response && response.status === 200) {
                (this.api_statuses as any)[callName] = 'success';
                this.api_status = 'success';
                statusMessage = 'Status: success';
            } else {
                (this.api_statuses as any)[callName] = 'error';
                this.api_status = 'error';
                statusMessage = response
                    ? `Status: error - Error: ${response.statusText}`
                    : 'Status: error - No response';
            }
            return `${statusMessage}`;
        },
        // *************** Session Data ***************
        saveSessionData(): void {
            sessionStorage.setItem('quick_contacts_list', JSON.stringify(this.quick_contacts_list));
        },
        loadSessionData(): void {
            this.quick_contacts_list = sessionStorage.getItem('quick_contacts_list')
                ? JSON.parse(sessionStorage.getItem('quick_contacts_list')!)
                : [{}, {}, {}, {}];
        },
    },
});
