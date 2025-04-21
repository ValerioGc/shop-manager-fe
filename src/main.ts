import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/index';
import { createHead } from '@vueuse/head';

const pinia = createPinia();
const head = createHead();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(head);

app.mount('#app');
