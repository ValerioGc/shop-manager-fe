<script setup lang="ts">

import { onBeforeMount, ref, watch, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { global_store } from '@/stores/global_store';

import CommonSpinner from '@/components/utils_components/placeholders/CommonSpinner.vue';
import type { ShowList } from '@/types/entity/ShowList';
const ResultsPlaceholder = defineAsyncComponent(() => import('@/components/utils_components/placeholders/ResultsPlaceholder.vue'));
const CommonPager = defineAsyncComponent(() => import('@/components/utils_components/CommonPager.vue'));

const store = global_store();
const route = useRoute();
const router = useRouter();

// ############## Pager ################
const page = ref<number>(parseInt((route.query.page as string) || '1'));
const perPage = ref<number>(store.config.pagination.showPageOldPagination || 4);
const shws = ref<ShowList[]>([]);
const isLoading = ref<boolean>(true);
const listSize = ref<number>(0);


/**
  * Get the old shows from the API and save them in the store
*/
async function getOldShows(): Promise<void> {
  if (store.cached.show_old._pages[page.value] && store.cached.show_old._pages[page.value].length > 0) {
    shws.value = store.cached.show_old._pages[page.value];
    listSize.value = store.cached.show_old.total;
    isLoading.value = false;
    return;
  }

  store.apiDispatcher(`/show/old?page=${page.value}&limit=${perPage.value}&orderBy=created_at&order=desc`, 'showO')
    .then((res) => {
      shws.value = res.data;
      listSize.value = res.total;

      // Save in the store cache if the length is less than 7
      if (Object.keys(store.cached.show_old._pages).length < 7) {
        store.cached.show_old._pages[page.value] = Array.isArray(res.data) ? res.data : [];
        store.cached.show_old.total = res.total;
      }

      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
}

/**
* Update the current page and get the old shows
* @param {number} newPage - The new page to go to
*/
const updateCurrentPage = (newPage: number): void => {
  page.value = newPage;
  router.push({ query: { ...route.query, page: newPage } });
};

/**
  * Update the current page and get the old shows
  * @param {number} newPage - The new page to go to
*/
watch(() => [route.query.page], (newPage) => {
  page.value = parseInt(typeof newPage === 'string' ? newPage : '1') || 1;
  getOldShows();
});

onBeforeMount(() => {
  getOldShows();
});

</script>

<template>

  <CommonSpinner v-if="store.api_statuses.showO === 'loading'" mode="dots" size="md" />

  <ResultsPlaceholder :refresh="false" v-else-if="store.cached.show_old.total === 0" />

  <div class="show_list_container" v-else id="showO_view" :aria-busy="store.api_statuses.showO !== 'loading'">
    <ul class="show_list">
      <li v-for="(exb, index) in store.cached.show_old._pages[page]" :key="index" class="show_list_item">

        <div class="list_item_wrapper">
          <div class="show_banner">
            <img v-if="exb.image_url && store.api_statuses.showO !== 'loading'" class="" :src="exb.image_url"
              alt="exhibition" />
            <img v-else src="@/assets/placeholders/phl.svg" alt="exhibition" class="show_banner" />
          </div>

          <div class="content_wrapper">
            <p class="show_title ellipsis" v-if="store.api_statuses.showO !== 'loading' && exb.label_ita"
              :title="store.language === 'ita' ? exb.label_ita : exb.label_eng">
              {{ store.language === 'ita' ? exb.label_ita : exb.label_eng }}
            </p>

            <p class="secondary_icon ellipsis" :title="exb.start_date"
              v-if="store.api_statuses.showO !== 'loading' && exb.start_date">
              <img src="@/assets/icons/calendar.svg" alt="calendar icon" loading="lazy" />
              <span>{{ exb.start_date }}</span>
            </p>
            <p v-if="store.api_statuses.showO !== 'loading' && exb.location" class="secondary_icon ellipsis"
              :title="exb.location">
              <img src="@/assets/icons/map.svg" alt="map icon" loading="lazy" />
              <span>{{ exb.location }}</span>
            </p>

            <div class="link_container">
              <RouterLink :to="`/name/shows/${exb.id}`" class="btn_e btn_primary ">
                Vedi le foto
              </RouterLink>
            </div>
          </div>
        </div>

      </li>
    </ul>
    <div v-if="listSize > (store.config.pagination.showPageOldPagination || 999)">
      <CommonPager :list-size="listSize" :per-page="perPage" @update:currentPage="updateCurrentPage" />
    </div>
  </div>

</template>

<style lang="scss" scoped>
.show_list_container {
  @include flexmin(center, center, column, null, .5rem);

  .show_list {
    @extend %full_wh;
    @include flexmin(center, center, column, wrap, 1rem);

    @media screen and (min-width: 1100px) {
      flex-direction: row;
      justify-content: space-between;
    }

    .show_list_item {
      width: 100%;
      overflow: hidden;
      border: 0.8px solid var(--secondary-color);
      box-shadow: 0 0 6px #c4c4c47b;
      border-radius: var(--border_radius);
      background-color: #fdfdfd;
      align-content: center;

      @media screen and (min-width: 680px) {
        width: 80%;
      }

      @media screen and (min-width: 920px) {
        height: 200px;
        width: 70%;
      }

      @media screen and (min-width: 1000px) {
        height: 200px;
        width: 48%;
      }

      .list_item_wrapper {
        @include flexmin(center, center, column, null, 1rem);
        text-align: center;
        background-color: #fafafa;


        @media screen and (min-width: 480px) {
          flex-direction: row;
          text-align: start;
          justify-content: space-between;
        }

        .content_wrapper {
          @extend %full_wh;
          padding: .5rem;

          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;

          @media screen and (min-width: 480px) {
            text-align: start;
          }

          img {
            width: 1.25rem;
            height: 1.25rem;
          }

          .link_container {
            margin: .25rem 0;
            padding: .25rem 0;
          }
        }

        .show_banner {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-bottom: .5px solid lightgray;
          @include border_radius('top', var(--border_radius));
          flex-shrink: 0;

          @media screen and (min-width: 480px) {
            width: 180px !important;
            height: 200px;
            border-right: 0.5px solid var(--secondary-color);
            border-radius: 0;
            box-shadow: 0 3px 6px rgba(59, 59, 59, 0.322);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
}

// ************ Ellipsis ************
.ellipsis {
  @extend %ellipsis_text;

  &:first-child,
  &:last-child {
    font-weight: bold !important;
  }
}

.show_title.ellipsis {
  margin-bottom: 1rem;
  color: var(--secondary-color);
  font-size: 1.65rem;
  max-width: 450px;

  @media screen and (min-width: 420px) {
    max-width: 500px;
  }

  @media screen and (min-width: 580px) {
    max-width: 550px;
  }

  @media screen and (min-width: 1300px) {
    -webkit-line-clamp: 3;
  }
}

.secondary_icon.ellipsis {
  max-width: 250px;
  margin: auto;
  padding-bottom: .5rem;
  opacity: .7;

  @media screen and (min-width: 480px) {
    margin: 0;
  }

  img {
    margin-right: .5rem;
  }

  span,
  img {
    vertical-align: middle;
  }

}
</style>