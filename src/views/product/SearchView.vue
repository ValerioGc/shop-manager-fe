<script setup lang="ts">

import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { global_store } from '@/stores/global_store';

import SectionTitle from '@/components/layout/layout_elements/SectionTitle.vue';
import ProductList from '@/components/product/ProductList.vue';
import { useHead } from '@vueuse/head';

import type { ProductsList } from '@/types/entity/ProductsList';

const route = useRoute();
const store = global_store();

// ************ Pagination ************
const products = ref<ProductsList[]>([]);
const listSize = ref<number>(0);
const isLoading = ref<boolean>(false);
const page = ref<number>(parseInt(route.query.page as string) || 1);
const perPage = ref<number>(store.config.pagination.homeProductPagePagination || 8);
const searchCategory = ref<boolean>(route.query.category === 'true');


/**
  * Edit the SEO meta tags
*/
const headConfig = computed(() => {

  const standardKeyword: string = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  if (standardKeyword !== '' || route.query.text !== '')
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', route.query.text + ', ' + standardKeyword);

  return {
    title: route.query.text + ' | Shop Name',
    meta: [
      {
        name: 'og:title',
        content: route.query.text + ' | Shop Name'
      },
    ]
  };

});

useHead(headConfig);

/**
  * Search products by query string on the API
  * @returns {void}
*/
const searchProducts = async (): Promise<void> => {
  isLoading.value = true;
  const query = route.query.text as string;
  const url = `/search/products?query=${query}`
    + `&page=${page.value}`
    + `&limit=${perPage.value}`
    + `&order_by=created_at`
    + `&order=asc`
    + `&lang=${store.language}`;

  if (store.cached.search.last_query !== query || listSize.value === 0) {
    store.cached.search._pages = {};
    store.cached.search.total = 0;
    store.cached.search.last_query = query;
  }

  if (store.cached.search._pages[page.value]) {
    products.value = store.cached.search._pages[page.value];
    listSize.value = store.cached.search.total;
    isLoading.value = false;
    return;
  }

  await store.apiDispatcher(url, 'search')
    .then((res) => {
      products.value = res.data;
      listSize.value = res.total;

      const cachedPages = store.cached.search._pages;
      if (Object.keys(cachedPages).length < 7) {
        cachedPages[page.value] = res.data;
        store.cached.search.total = res.total;
      }

      isLoading.value = false;

      if (store.console_debug) console.table(products.value);
    })
    .catch(() => {
      isLoading.value = false;
    });
};



/**
  * Watch for changes in the page query
*/
watch(
  () => [route.query.page], ([newPage]) => {
    page.value = parseInt(newPage as string) || 1;
    searchProducts();
  }
);

onMounted(() => {
  searchProducts();
});

</script>


<template>
  <div class="search_result_container" id="search_view">

    <div>
      <!-- Section Title -->
      <SectionTitle>
        <h1>{{ store.language === 'ita' ? store.config.titles.searchPageTitle.ita + ' \'' + route.query.text + '\'' :
          store.config.titles.searchPageTitle.eng + ' \'' + route.query.text + '\'' }}</h1>
      </SectionTitle>

      <hr />
    </div>

    <!-- Search Results -->
    <KeepAlive>
      <ProductList :isLoading="isLoading" :pagination="perPage" :listSize="listSize" :products="products" />
    </KeepAlive>

  </div>
</template>

<style lang="scss" scoped>
.search_result_container {
  padding: 3rem 2rem;
  margin: 0 auto 2rem auto;

  @media screen and (min-width: 992px) {
    width: 90%;
  }

  @media screen and (min-width: 1200px) {
    width: 85%;
  }

  @media screen and (min-width: 1400px) {
    width: 80%;
  }

  .section-title {
    text-align: center;
    padding-bottom: 1rem;
  }
}
</style>
