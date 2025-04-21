<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';
import { global_store } from '@/stores/global_store';

import CommonPlaceholder from '@/components/utils_components/placeholders/CommonPlaceholder.vue';
import ImagePlaceholder from '@/components/utils_components/placeholders/ImagePlaceholder.vue';
import type { ProductsList } from '@/types/entity/ProductsList';

const store = global_store();

const props = defineProps<{
  product: ProductsList;
  link: string;
}>();

const isImageLoaded = ref<boolean>(false);
const imageError = ref<boolean>(false);
const imageSrc = ref<string>(props.product.image_url || '');

const handleImageLoad = (): void => {
  isImageLoaded.value = true;
};

const handleImageError = (): void => {
  imageError.value = true;
  isImageLoaded.value = true;
};

watch(
  () => props.product.image_url, (newVal) => {
    if (newVal) {
      imageSrc.value = newVal;
      imageError.value = false;
      isImageLoaded.value = false;
    } else {
      imageError.value = true;
      isImageLoaded.value = true;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.product.image_url) {
    imageSrc.value = props.product.image_url;
  }
  else {
    imageError.value = true;
    isImageLoaded.value = true;
  }
});

</script>

<template>
  <li class="cards_item"
    :class="{ 'disabs': store.api_statuses.products === 'loading' || store.api_statuses.search === 'loading' }">
    <RouterLink class="carde" v-if="props.product.label_ita !== null && props.product.label_eng !== null"
      :to="props.link" :class="{ 'disab': store.api_statuses.products === 'loading' }">
      <div class="card_image">
        <!-- Show image if loaded successfully -->
        <img v-if="!imageError && props.product.image_url" :src="imageSrc"
          :alt="store.language === 'ita' ? props.product.label_ita + ' immagine' : props.product.label_eng + ' image'"
          @load="handleImageLoad" @error="handleImageError" />

        <!-- Show placeholder if loading or API is in progress -->
        <CommonPlaceholder
          v-else-if="!isImageLoaded || store.api_statuses.products === 'loading' || store.api_statuses.search === 'loading'"
          mode="box" />

        <!-- Show default placeholder if image fails -->
        <ImagePlaceholder v-else :lang="store.language" />
      </div>
      <div class="card_content">
        <!-- Show placeholders while loading -->
        <CommonPlaceholder v-if="store.api_statuses.products === 'loading' || store.api_statuses.search === 'loading'"
          mode="md" />

        <h2 class="card_title" v-else
          :title="store.language === 'ita' ? props.product.label_ita : props.product.label_eng">
          {{ store.language === 'ita' ? props.product.label_ita : props.product.label_eng }}
        </h2>

        <CommonPlaceholder v-if="store.api_statuses.products === 'loading' || store.api_statuses.search === 'loading'"
          mode="xs" />
        <p class="card_text"
          v-else-if="typeof props.product.price === 'number' || (typeof props.product.price === 'string' && /^\d/.test(props.product.price))">
          {{ props.product.price }} </p>
        <p v-else>-</p>
      </div>
    </RouterLink>
  </li>
</template>

<style lang="scss" scoped>
.cards_item {
  width: 100%;
  display: flex;
  margin: auto;
  padding: 1rem 0.45rem;
  cursor: pointer;

  &.disabs {
    cursor: wait !important;
  }

  @media (min-width: 480px) {
    width: 85%;
  }

  @media (min-width: 580px) {
    margin: unset;
    width: calc(100% / 2);
  }

  @media (min-width: 768px) {
    width: calc(100% / 3);
  }

  @media (min-width: 912px) {
    width: calc(100% / 3);
  }

  @media (min-width: 1190px) {
    width: calc(100% / 4);
  }

  @media (min-width: 1700px) {
    width: calc(100% / 6);
  }

  @media (min-width: 2000px) {
    width: calc(100% / 7);
  }

  .card_image {
    position: relative;
    width: 100%;
    height: 200px;
    background-color: #dbdbdb;

    img {
      height: 200px;
      width: 100%;
      object-fit: contain;
    }
  }

  .carde {
    width: 100%;
    height: 330px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 0.2px solid rgba(185, 185, 185, 0.65);
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 20px 40px -18px #00000070;
    transition: linear 0.3s;

    &.disab {
      pointer-events: none;
      opacity: 0.5;
    }

    &:hover {
      box-shadow: 0 0 9px -2px #273ba6 !important;
      scale: 1.04;
    }

    .card_content {
      @include flexmin(space-evenly, center, column);
      @extend %capitalize_start;
      height: calc(100% - 200px);
      text-align: center;
      padding: 0.25rem 0.5rem;
      background-color: #fafafa;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);

      .card_title {
        padding-bottom: 0;
        text-shadow: 0 0 .5px #d4d4d4aa;
        color: #1a1fab;
      }

      .card_title {
        display: -webkit-box;
        /* Crea una scatola flessibile */
        -webkit-box-orient: vertical;
        /* Imposta l'orientamento verticale */
        -webkit-line-clamp: 2;
        /* Imposta il limite massimo di righe a 2 */
        overflow: hidden;
        /* Nasconde il testo in eccesso */
        text-overflow: ellipsis;
        /* Aggiunge l'ellissi */
        white-space: normal;
        /* Permette la gestione delle righe multiple */
        word-wrap: break-word;
        /* Gestisce correttamente le parole lunghe */
        font-size: 1.2rem;
        /* Regola la dimensione del testo */
        font-weight: 700;
        /* Imposta il peso del font */
        width: 90%;
      }

      .card_text {
        font-weight: 600;
        font-style: italic;
      }
    }
  }
}
</style>
