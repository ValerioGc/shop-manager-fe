<script setup lang="ts">

import { ref } from 'vue';
import { global_store } from '@/stores/global_store';

import CommonSpinner from '@/components/utils_components/placeholders/CommonSpinner.vue';

const store = global_store();

const emit = defineEmits<{ (event: 'openModal'): void }>();

// ************ Image Management ************
const imageLoad = ref<boolean>(true);
const imageError = ref<boolean>(false);

/**
  * Manage the image loading
  * @param {string} type - The type of event
*/
function manage(type: string): void {
  if (type === 'load') {
    imageLoad.value = false;
  }
  else {
    imageError.value = true;
    imageLoad.value = false;
  }
}

</script>

<template>
  <div>
    <img src="@/assets/decorations/wave1.svg" alt="show" class="decoration_wave" />

    <div class="maim_d">

      <div class="show_text">
        <p v-text="store.language === 'ita' ? store.config.text.showsPageText.ita : store.config.text.showsPageText.eng">
        </p>
      </div>

      <!-- Spinner and Image -->
      <div class="picture_container"
        v-if="store.config.settings.enableShowBanner && !imageError || store.config.settings.enableShowBanner && store.config.settings.showPageImg && store.config.settings.showPageImg.length > 0">
        <div v-if="imageLoad" class="spinner_cer">
          <CommonSpinner mode="spinner" size="lg" />
        </div>
        <img :src="store._host + store.config.settings.showPageImg || undefined" class="show_picture" alt="show picture"
          loading="eager" @load="manage('load')" @error="manage('error')" @click.prevent="emit('openModal')" />

        <div class="resize">
          <img src="@/assets/icons/arrows-fullscreen.svg" alt="resize icon" loading="lazy" />
        </div>

      </div>
    </div>
    <img src="@/assets/decorations/wave2.svg" alt="show" class="decoration_wave last" />
  </div>
</template>

<style lang="scss" scoped>
.decoration_wave {
  width: 100%;
  display: block;
  transform: translateY(1px);

  &.last {
    transform: translateY(-1px);
  }
}

.maim_d {
  @include flexmin(space-between, center, column-reverse, null, 1rem);
  color: white;
  background-color: var(--secondary-color);
  padding: 1rem 0.75rem;

  @media screen and (min-width: 920px) {
    flex-direction: row;
  }
}

.show_text {
  padding: 0 0.65rem;
  margin: 0.65rem 0;

  line-height: 1.25rem;

  @media screen and (min-width:450px) {
    line-height: 1.35rem;
    font-size: 1rem;
  }

  @media screen and (min-width:580px) {
    line-height: 1.45rem;
    font-size: 1.05rem;
  }

  @media screen and (min-width:920px) {
    line-height: 1.65rem;
    font-size: 1.1rem;
  }

  @media screen and (min-width:1200px) {
    font-size: 1.25rem;
    line-height: 1.7rem;
  }
}

.picture_container {
  position: relative;
  box-shadow: 0 0 8px 0 rgba(59, 59, 59, 0.158);
  background: rgba(234, 234, 234, 0.623);
  border-radius: var(--border_radius);
  width: 100%;
  height: 200px;
  margin: auto;
  flex-shrink: 0;

  @media screen and (min-width: 350px) {
    width: 90%;
  }

  @media screen and (min-width: 480px) {
    width: 80%;
  }

  @media screen and (min-width: 580px) {
    width: 75%;
  }

  @media screen and (min-width: 768px) {
    width: 60%;
  }

  @media screen and (min-width: 850px) {
    width: 55%;
  }

  @media screen and (min-width: 920px) {
    width: 300px !important;
  }

  @media screen and (min-width: 1200px) {
    width: 420px !important;
    height: 260px !important;
  }

  .spinner_cer {

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    @extend %fx_center;
    background: rgba(144, 144, 144, 0.315);
    border-radius: var(--border_radius);
    padding: 1rem;
    z-index: var(--z_1);
  }

  .show_picture {
    @extend %full_wh;
    object-fit: fill;
    transition: all 0.2s linear;
    border-radius: var(--border_radius);

    @media screen and (min-width: 768px) {
      object-fit: cover;
    }

    &:hover {
      cursor: pointer;
      filter: brightness(0.7);
    }

  }

  .resize {
    @extend %fx_center;

    position: absolute;
    top: 5px;
    right: 5px;

    width: 35px;
    height: 35px;

    background: var(--secondary-color);
    border-radius: var(--border_round);
    padding: 0.25rem;

    img {
      width: 100%;
      height: 100%;
      padding: 0.25rem;
      filter: invert(1);
    }
  }
}
</style>