<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">

import { onMounted, ref, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { global_store } from '@/stores/global_store';

import type { ProductsList } from '@/types/entity/ProductsList';
import ProductList from '@/components/product/ProductList.vue';
import SectionTitle from '@/components/layout/layout_elements/SectionTitle.vue';
import CommonSpinner from '@/components/utils_components/placeholders/CommonSpinner.vue';
import CommonPlaceholder from '@/components/utils_components/placeholders/CommonPlaceholder.vue';

const ShowCarousel = defineAsyncComponent(() => import('@/components/show/ShowCarousel.vue'));
const ResultsPlaceholder = defineAsyncComponent(() => import('@/components/utils_components/placeholders/ResultsPlaceholder.vue'));

const route = useRoute();

const store = global_store();

// *********** Banner management ***********
const imgErr = ref<boolean>(false);
const er = (): void => {
  imgErr.value = true;
};
const imgLoaded = ref<boolean>(true);

const removeDisplayNone = () => {
  const banner = document.querySelector('.banner_img_container') as HTMLImageElement;
  if (banner) {
    // banner.style.display = 'block!important';
    imgLoaded.value = false;
  }
};

/**
* Fetch new shows from the API
* @returns {void}
*/
async function getNextShows(): Promise<void> {
  try {
    await store.apiDispatcher('/show/new', 'showN')
      .then((res: any) => {
        store.cached.show_new = res.data;
        if (store.console_debug) console.log('new shows', store.cached.show_new);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    store.cached.show_new = [];
    if (store.console_debug) console.error('Error fetching new shows', error);
  }
}

// ************ Pagination ************
const products = ref<ProductsList[]>([]);
const listSize = ref<number>(0);
const page = ref<number>(parseInt(route.query.page as string) || 1);
const perPage = ref<number>(store.config.pagination.homeProductPagePagination || 10);
const isLoading = ref<boolean>(false);

/**
* Fetch products from the API
* @returns {void}
*/
const fetchProducts = async (): Promise<void> => {
  isLoading.value = true;
  const url = `/product/filter/paginate?page=${page.value}&limit=${perPage.value}&order_by=created_at&order=asc&in_evidence=true`;

  if (store.cached.latest._pages[page.value]) {
    products.value = store.cached.latest._pages[page.value];
    listSize.value = store.cached.latest.total;
    isLoading.value = false;
    return;
  }

  await store.apiDispatcher(url, 'products')
    .then((prd: any) => {
      products.value = prd.data as ProductsList[];
      listSize.value = prd.total;

      if (Object.keys(store.cached.latest._pages).length < 7) {
        store.cached.latest._pages[page.value] = prd.data as ProductsList[];
        store.cached.latest.total = prd.total;
      }

      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
};

// Watch for changes in route page
watch(() => [route.query.page], ([newPage]) => {
  page.value = parseInt(newPage as string) || 1;
  fetchProducts();
}
);

onMounted(async () => {
  if ((store.config.settings.showHomeShowSection && !store.cached.show_new) ||
    (store.cached.show_new && store.cached.show_new.length === 0)
  ) {
    getNextShows();
  }

  fetchProducts();
});

</script>

<template>
  <div class="main_view">
    <!-- Banner -->
    <div class="banner_img_container" :class="{ 'display': !imgErr && !imgLoaded }"
      v-if="store.config != null && store.config.settings.showHomeBanner && store.config.settings?.bannerImg != '' && !imgErr">

      <img :src="store._host + store.config.settings.bannerImg" @error="er" @load="removeDisplayNone()"
        alt="banner shop" class="banner-img" load="eager" />

      <div class="spinner_container" v-if="imgLoaded && !imgErr">
        <CommonSpinner mode="dots" />
      </div>
    </div>

    <div>
      <!-- Home section -->
      <section class="welcome_section">
        <SectionTitle v-if="store.config.settings.showHomeTitle">
          <h1 class="section-title">
            {{ store.language === 'ita' ? store.config.titles.homeTitleText.ita :
              store.config.titles.homeTitleText.eng }}
          </h1>
        </SectionTitle>

        <p class="home_description" v-if="store.config.text.homePageDescriptionText.ita !== null">
          {{ store.language === 'ita' ? store.config.text.homePageDescriptionText.ita :
            store.config.text.homePageDescriptionText.eng }}
        </p>
        <p v-else style="margin: .25rem auto;">
          <CommonPlaceholder :mode="'md'" v-for="i of 4" :key="i" />
        </p>
      </section>

      <!-- Latest Product Section -->
      <section class="latest_section" id="latestProd">
        <div class="latest_container">
          <div class="product_view_head">
            <SectionTitle>
              <h2>{{ store.language === 'ita' ? 'Ultimi Arrivi' : 'New Arrivals' }}</h2>
            </SectionTitle>

            <RouterLink class="btn_e btn_primary" to="/name/products">
              {{ store.language === 'ita' ? 'Vai ai prodotti' : 'Go to products' }}
            </RouterLink>
          </div>
        </div>

        <hr />

        <ProductList :isLoading="isLoading" :pagination="perPage" :listSize="listSize" :products="products" />
      </section>

      <!-- Show Carousel Section -->
      <section class="show_section" v-if="store.config.settings.showHomeShowSection">
        <div class="show_container">

          <div class="product_view_head">
            <SectionTitle>
              <h2>{{ store.language === 'ita' ? 'Prossime Fiere ed Eventi' : 'Next Shows and events' }} </h2>
            </SectionTitle>
            <RouterLink class="btn_e btn_primary" to="/name/shows">
              {{ store.language === 'ita' ? 'Vai alle fiere' : 'Go to shows' }}
            </RouterLink>
          </div>

          <hr />

          <ShowCarousel
            v-if="store.api_statuses.showN === 'loading' || store.cached.show_new && store.cached.show_new.length > 0"
            :items="store.cached.show_new" />

          <ResultsPlaceholder v-else :refresh="false"
            :pl_text="store.language === 'ita' ? 'Nessuna fiera in programma' : 'No shows scheduled'" />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main_view {
  padding-top: 0 !important;

  // reset
  .btn_e {
    padding: 0.25rem;

    @media screen and (min-width: 768px) {
      padding: .35rem .5rem;
    }

    @media screen and (min-width: 992px) {
      padding: .5rem .75rem;
    }
  }

  .section-title {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }

  .banner_img_container {
    width: 100%;
    box-shadow: 0 0 6px gray;
    object-fit: cover;
    object-position: center;
    position: relative;


    &:not(.display) {
      display: none;
    }

    .banner-img {
      /*display: none;*/
      width: 100%;
      max-height: 500px;
    }

  }

  .spinner_container {
    @extend %fx_center;
    @extend %full_wh;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .welcome_section {
    margin: 1rem 0;

    @media screen and (min-width: 768px) {
      width: 75% !important;
      margin: 1rem auto 1.5rem;
    }

    @media screen and (min-width: 920px) {
      width: 60% !important;
      margin: 1.5rem auto 2rem;
    }

    @media screen and (min-width: 1200) {
      width: 50% !important;
    }

    .home_description {
      font-size: 1.1rem;
      text-rendering: optimizeSpeed;
      padding: 1.7rem 1rem 1rem;
      line-height: 1.75rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-align: justify;

      @media screen and (min-width: 768px) {
        font-size: 1.2rem;
      }

      @media screen and (min-width: 992px) {
        font-size: 1.3rem;
      }
    }

    h1 {
      font-weight: bold;
      font-size: 1.8rem;
      text-align: center;
      letter-spacing: 1px;

      @media screen and (min-width: 580px) {
        font-size: 2rem;
      }

      @media screen and (min-width: 992px) {
        font-size: 2.5rem !important;
      }

      @media screen and (min-width: 1200px) {
        font-size: 2.75rem !important;
      }
    }
  }

  h2 {
    color: var(--secondary-color);
    padding: 1rem 0;
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0;
    text-align: left;

    @media screen and (min-width: 480px) {
      font-size: 1.65rem;
    }

    @media screen and (min-width: 580px) {
      font-size: 1.75rem;
    }

    @media screen and (min-width: 768px) {
      font-size: 2rem !important;
    }

    @media screen and (min-width: 1200px) {
      font-size: 2.2rem !important;
    }
  }

  .show_section,
  .latest_section {
    padding: 1.5rem .5rem;

    @media screen and (min-width: 580px) {
      padding: 1.5rem .75rem;
    }

    @media screen and (min-width: 768px) {
      padding: 1.5rem 1rem;
    }

    @media screen and (min-width: 1000px) {
      width: 90% !important;
      margin: 0 auto;
    }

    @media screen and (min-width: 1200px) {
      width: 80% !important;
      margin: 0 auto;
    }

    @media screen and (min-width: 1600px) {
      width: 75% !important;
    }

    .latest_container {
      @extend %fx_between_center;
      @extend %full_width;
      @extend %tx_center;

      padding: 0.25rem;
      margin-bottom: 0;
      padding-bottom: 0;

      @media screen and (min-width: 768px) {
        padding: 0.5rem;
      }

      @media screen and (min-width: 1200px) {
        padding: 0.75rem;
      }

      .btn_e {
        @media screen and (min-width: 768px) {
          padding: 0.5rem;
        }

      }
    }

    .show_container {
      padding: 0.25rem;
      margin-bottom: 0;
      padding-bottom: 0;

      @media screen and (min-width: 768px) {
        padding: 0.5rem;
      }

      @media screen and (min-width: 1200px) {
        padding: 0.75rem;
      }

      .product_view_head {
        margin-bottom: 1rem;
      }

      hr {
        margin-bottom: 1.25rem;
      }
    }

    .product_view_head {
      @extend %fx_between_center;
      @extend %full_width;
      gap: .5rem;

      a {
        font-weight: bold;
        color: #fff !important;
        background-color: #273ba6 !important;

        &:hover {
          background: fixed #273ba6 !important;
          opacity: 0.9;
          box-shadow: 0 0 5px 0 #273ba6;
        }
      }
    }
  }
}
</style>
