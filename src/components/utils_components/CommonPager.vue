<script setup lang="ts">

import { computed, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { global_store } from '@/stores/global_store';

interface Props {
  listSize: number;
  perPage: number;
}

const props = defineProps<Props>();

const store = global_store();
const route = useRoute();
const router = useRouter();

const emit = defineEmits<{ (event: 'update:currentPage', page: number): void }>();
const windowWidth = ref<number>(window.innerWidth);
const latestProd = ref<HTMLElement | null>(null);

// *************** Pager management *************** 
const currentPage = ref<number>(route.query.page ? parseInt(route.query.page as string) || 1 : 1);
const totalPages = computed<number>(() => Math.ceil(props.listSize / props.perPage));

/**
* Computed property for pages with ellipsis
* @returns {Array} - The array of pages to show
*/
const pagesToShow = computed<(number | string)[]>(() => {
  const pages: (number | string)[] = [];
  let maxPagesToShow: number;

  if (windowWidth.value <= 350) {
    maxPagesToShow = 1;
  } else if (windowWidth.value <= 768) {
    maxPagesToShow = 3;
  } else {
    maxPagesToShow = 5;
  }

  if (totalPages.value <= maxPagesToShow + 2) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let startPage = Math.max(currentPage.value - Math.floor(maxPagesToShow / 2), 2);
    let endPage = Math.min(currentPage.value + Math.floor(maxPagesToShow / 2), totalPages.value - 1);

    if (currentPage.value <= Math.ceil(maxPagesToShow / 2)) {
      startPage = 2;
      endPage = maxPagesToShow;
    }

    if (currentPage.value >= totalPages.value - Math.floor(maxPagesToShow / 2)) {
      startPage = totalPages.value - maxPagesToShow + 1;
      endPage = totalPages.value - 1;
    }

    pages.push(1);
    if (startPage > 2) pages.push('...');
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages.value - 1) pages.push('...');
    pages.push(totalPages.value);
  }

  return pages;
});

/**
* Change page and scroll to top 
* @param {number} page - The page number to navigate to
* @returns {void}
* @emits update:currentPage
* @emits router.push
* @emits window.scrollTo 
*/
function changePage(page: number): void {
  if (page === currentPage.value) return;

  let val: string | null = null;
  if (route.name === 'home') {
    val = 'latestProd';
  } else if (route.name === 'search') {
    val = 'search_view';
  }
  if (route.name === 'products') {
    val = 'product_list';
  }
  if (route.name === 'shows') {
    val = 'showO_view';
  }

  if (val != null) {
    latestProd.value = document.getElementById(val);
    if (latestProd.value) {
      window.scrollTo({ top: latestProd.value.offsetTop - 50, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      emit('update:currentPage', page);
      router.push({ query: { ...route.query, page } });
    }
  }
}

// Watch for route changes and update currentPage
watch(() => route.query.page, (newPage) => {
  currentPage.value = newPage ? parseInt(newPage as string) || 1 : 1;
}
);

onMounted(() => {
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
});

</script>

<template>
  <nav role="navigation" aria-label="Pagination Navigation">
    <ul class="pager" :class="{ 'load_disabled': store.api_status === 'loading' }">

      <!-- Previous page button -->
      <li class="page_button_item"
        :class="{ 'disabled': currentPage === 1, 'load_disabled': store.api_status === 'loading' }"
        @click.prevent="changePage(currentPage - 1)">
        <img :aria-label="store.language === 'ita' ? 'Pagina precedente' : 'Previous page'" aria-hidden="true"
          src="@/assets/icons/chevron-double-left.svg" alt="previous" class="icon" loading="lazy" />
      </li>

      <!-- Pages buttons with ellipsis -->
      <li v-for="page in pagesToShow" :key="page"
        :class="{ 'active': page === currentPage, 'disabled': page === '...', 'load_disabled': store.api_status === 'loading' }"
        class="page_item">
        <a class="page_link" href="#" @click.prevent="typeof page === 'number' && changePage(page)"
          :aria-label="store.language === 'ita' ? 'Vai a pagina ' + page : 'Go to page ' + page"
          :aria-current="page === currentPage">
          {{ page }}
        </a>
      </li>

      <!-- Next page button -->
      <li class="page_button_item"
        :class="{ 'disabled': currentPage === totalPages, 'load_disabled': store.api_status === 'loading' }"
        @click.prevent="changePage(currentPage + 1)">
        <img :aria-label="store.language === 'ita' ? 'Prossima pagina' : 'Next page'" aria-hidden="true"
          src="@/assets/icons/chevron-double-right.svg" alt="next" class="icon" loading="lazy" />
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  margin: 2rem 0 0 0;

  .pager {
    @extend %fx_center;

    &.load_disabled {
      pointer-events: none;
      cursor: progress !important;
      opacity: 0.7;
    }

    .page_button_item {
      padding: 0.5rem 0.75rem;
      background-color: #e9ecef !important;
      color: invert(1);

      &.disabled a {
        pointer-events: none;
        cursor: not-allowed;
      }

      &.load_disabled a {
        pointer-events: none;
        cursor: progress;
      }

      &:not(.disabled):not(.load_disabled) {
        cursor: pointer;
      }

      &:hover:not(.disabled):not(.load_disabled) {
        filter: brightness(0.9);
      }

      img {
        width: 1rem;
        height: 1rem;
      }
    }

    .page_button_item:first-child,
    .page_button_item:last-child {
      @extend %fx_center;
      padding: .8rem .75rem;
    }

    .page_button_item:first-child {
      @include border_radius('left', 5px);
    }

    .page_button_item:last-child {
      @include border_radius('right', 5px);
    }

    .page_button_item,
    .page_item {
      border: 0.1px solid gray;
      background-color: #f8f9fa;
    }

    .page_link:not(:first-child),
    .page_link:not(:last-child) {
      padding: .5rem .5rem;
    }

    .page_link {
      display: block;
      padding: .5rem .7rem;

      @media screen and (min-width: 580px) {
        padding: .5rem 1rem;
      }

      &:hover {
        background-color: #273aa6ad;
        color: #fff;
      }
    }

    .active a {
      background-color: var(--secondary-color) !important;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
