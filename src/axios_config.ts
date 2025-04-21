import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { AxiosResponse } from 'axios';

// Token CSRF in meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
} else {
    console.warn('CSRF token not found in meta tag');
}

const abortControllerMap = new Map<string, AbortController>();

/**
  * Interceptor to abort requests with the same key (method and url)
  * @param config
*/
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (!config.headers) {
            config.headers = new axios.AxiosHeaders();
        }

        const method = config.method?.toUpperCase() || 'GET';
        const url = config.url || '';
        const requestKey = `${method}:${url}`;

        if (abortControllerMap.has(requestKey)) {
            abortControllerMap.get(requestKey)?.abort();
        }

        const controller = new AbortController();
        config.signal = controller.signal;
        abortControllerMap.set(requestKey, controller);

        return config;
    },
    (error) => Promise.reject(error)
);

/**
  * Interceptor to remove the request key from the map when the request is completed
  * @param response
*/
axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        const method = response.config.method?.toUpperCase() || 'GET';
        const url = response.config.url || '';
        const requestKey = `${method}:${url}`;

        abortControllerMap.delete(requestKey);
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        return Promise.reject(error);
    }
);

export default axios;
