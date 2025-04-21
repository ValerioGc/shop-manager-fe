<!-- eslint-disable vue/require-toggle-inside-transition -->
<script setup lang="ts">

import { defineAsyncComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ProductCard from './partials/ProductCard.vue';
import type { ProductsList } from '@/types/entity/ProductsList';

const NoResultsPlaceholder = defineAsyncComponent(() => import('@/components/utils_components/placeholders/ResultsPlaceholder.vue'));

const CommonPager = defineAsyncComponent(() => import('@/components/utils_components/CommonPager.vue'));

const route = useRoute();
const router = useRouter();

interface Props {
  products: ProductsList[];
  pagination: number;
  listSize: number;
  isLoading: boolean;
}

const props = defineProps<Props>();

/**
  * Change the current page
  * Emit the update:currentPage event from CommonPager component
  * Scroll to the top of the page
  * @param {number} page
  * @return {void}
  */
const updateCurrentPage = (newPage: number): void => {
  router.push({ query: { ...route.query, page: newPage } });
};

/**
  * Compute the list of products to display.
  * If `props.products` is not empty, it is used directly,
  * otherwise (typically during loading) "dummy" objects are created
  * based on the number specified in `props.pagination`.
*/
const displayedProducts = computed<ProductsList[]>(() => {
  return props.products.length
    ? props.products
    : Array.from({ length: props.pagination }, (_, i) => {
      return {
        id: i,
        label_ita: '',
        label_eng: '',
        price: 0,
        image_url: ''
      } as ProductsList;
    });
});

</script>

<template>
  <div class="product_container" :aria-busy="props.isLoading">

    <transition name="fade">
      <ul class="cards" v-if="props.isLoading || (!props.isLoading && props.products && props.products.length > 0)">
        <ProductCard v-for="(product, index) in displayedProducts" :key="index" :product="product"
          :link="'/name/product/detail/' + product.id" />
      </ul>
      <NoResultsPlaceholder :refresh="false" v-else />
    </transition>

    <div v-if="props.listSize > props.pagination">
      <CommonPager :list-size="props.listSize" :per-page="props.pagination" @update:currentPage="updateCurrentPage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product_container {
  margin-top: 0.25rem;

  .cards {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    list-style: none;

    margin: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
