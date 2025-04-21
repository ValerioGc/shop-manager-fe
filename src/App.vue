<script setup lang="ts">

import { ref, defineAsyncComponent, onBeforeMount } from 'vue';
import { global_store } from '@/stores/global_store';

import MainLayout from '@/components/layout/MainLayout.vue';

import LoadingMessage from '@/components/utils_components/LoadingMessage.vue';
import type { Contact } from './types/entity/Contact';
const MaintenanceMessage = defineAsyncComponent(() => import('@/components/utils_components/MaintenanceMessage.vue'));

const store = global_store();

/**
* Fetches the contacts for the quick contacts bar
  * @returns {void}
*/
async function getContactsBar(): Promise<void> {
  const cachedContacts = sessionStorage.getItem('quick_contacts_list');

  if (cachedContacts) {
    store.quick_contacts_list = JSON.parse(cachedContacts);
    store.api_contact_status = 'success';

    if (store.console_debug) {
      console.table(store.quick_contacts_list);
    }
  }
  else {
    store.api_contact_status = 'loading';

    await store.apiDispatcher('/contact/specific', 'specific')
      .then((res) => {

        store.quick_contacts_list = res.data.filter((contact: Contact) => {
          return contact.image_url && contact.image_url !== '';
        });

        if (store.quick_contacts_list.length > 0) {
          store.api_contact_status = 'success';
          sessionStorage.setItem('quick_contacts_list', JSON.stringify(store.quick_contacts_list));
        } else {
          store.api_contact_status = 'error';
        }

        if (store.console_debug) {
          console.table(store.quick_contacts_list);
        }
      });
  }
}

/**
 * Check the language settings and set the meta tag with selected language 
  * @returns {void}
*/
async function checkLanguageSettings(): Promise<void> {
  const metaLanguage = document.querySelector('meta[name="language"]');
  if (!metaLanguage) {
    console.warn('Meta tag "language" non trovato');
    return;
  }

  if (store.language === null) {
    store.language = 'ita';
    document.documentElement.lang = 'it';
    metaLanguage.setAttribute('content', 'it');
  } else {
    const langCode = store.language === 'ita' ? 'it' : 'en';
    document.documentElement.lang = langCode;
    metaLanguage.setAttribute('content', langCode);
  }
}

// *************** Configurations ***************
const isConfigLoading = ref<boolean>(true);
const maintenance = ref<boolean>(false);

/**
* Load the configuration from the API and check for maintenance status
* If the configuration is loaded successfully, check the language settings
* If the configuration is in maintenance, set the maintenance flag to true 
* @returns {void}
*/
onBeforeMount(async () => {
  await store.loadConfig()
    .then((res: string) => {
      if (!res || res == 'maintenance' || res == 'error') {
        maintenance.value = true;
      }
      if (store.config.settings.websiteMaintenance) {
        maintenance.value = true;
      }
      isConfigLoading.value = false;
      checkLanguageSettings();
    })
    .catch((err) => {
      maintenance.value = true;
      isConfigLoading.value = false;
      if (store.console_debug) console.error(err);
    });

  if (!maintenance.value)
    getContactsBar();

});

</script>

<template>

  <!-- Loading Page -->
  <LoadingMessage v-if="isConfigLoading" />

  <!-- Maintenance Page -->
  <MaintenanceMessage v-else-if="maintenance" />

  <!-- Main Layout -->
  <MainLayout v-else>
    <RouterView class="page" />
  </MainLayout>

</template>

<style lang="scss">
@use '@/styles/main.scss';
</style>