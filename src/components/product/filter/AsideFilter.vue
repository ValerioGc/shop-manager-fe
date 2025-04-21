<script setup lang="ts">

import { ref } from 'vue';

import { global_store } from '@/stores/global_store';
import { product_settings_store } from '@/stores/product_settings_store';
import CommonPlaceholder from '@/components/utils_components/placeholders/CommonPlaceholder.vue';

import chevron_up from '@/assets/icons/chevron-up.svg';
import chevron_down from '@/assets/icons/chevron-down.svg';

const store = global_store();
const productStore = product_settings_store();

const props = defineProps({
  mode: String, // mobile || desktop
});

const mobileDrop = ref(false);

/**
 * Handle the click on a category and update the breadcrumbs and the page query
 * @param level - The level of the category
 * @param labelIta - The italian label of the category
 * @param labelEng - The english label of the category
 * @param id - The id of the category
 * @param macroIndex - The index of the macro category
 * @returns {void}
*/
function handleCategoryClick(level: number, labelIta: string, labelEng: string, id: number | null, macroIndex: number | null) {
  if (store.api_statuses.products === 'loading') return;

  productStore.setBreadcrumb(level, labelIta, labelEng, id, macroIndex);
}

/**
 * Close the mobile dropdown
 * @returns {void}
*/
function closeDrop() {
  mobileDrop.value = false;
}

/**
 * Get the chevron direction based on the level and the id of the category
 * @param lvl - The level of the category
 * @param id - The id of the category
 * @returns {string} - The path of the chevron icon
*/
function getChevronDirection(lvl: number, id: number | null) {
  if (lvl === 1) {
    if (productStore.getExpandedCategoryIndex !== id)
      return chevron_down;
  } else {
    if (productStore.getExpandedInnerCategoryIndex !== id)
      return chevron_down;
  }
  return chevron_up;
}

</script>

<template>
  <aside :class="'aside_' + props.mode">

    <nav class="aside_cont">
      <div class="header_filter_tab_container">

        <h2 class="header_filter_tab">
          {{ store.language === 'ita' ? 'Categorie' : 'Categories' }}
        </h2>

        <button v-if="props.mode === 'mobile'" role="button" type="button" class="open_drop_btn"
          :disabled="store.cached.categories.length === 0" @click="mobileDrop = !mobileDrop">
          <img src="@/assets/icons/list.svg" alt="category filter toggle button" loading="lazy" />
        </button>
      </div>

      <transition :name="props.mode === 'desktop' ? '' : 'slide-fade'" v-if="mobileDrop || props.mode === 'desktop'">

        <ul role="menu" class="menu_wrapper"
          v-if="store.api_statuses.categories !== 'loading' && store.cached.categories != null && store.cached.categories.length > 0">
          <li v-for="(mc, index) in store.cached.categories" :key="index" role="menuitem">

            <!-- Macro Category Link -->
            <a v-if="mc.sub_categories?.length === 0" href="#" class="btn_dropdown_element" :class="{
              'active': productStore.getExpandedCategoryIndex === mc.id,
              'disabled_filter': store.api_statuses.products === 'loading'
            }" @click.prevent="handleCategoryClick(0, mc.label_ita, mc.label_eng, mc.id, index); closeDrop()">
              {{ store.language === 'ita' ? mc.label_ita : mc.label_eng }}
            </a>

            <div v-else>
              <!-- Macro Category Toggler -->
              <button class="btn_dropdown_element" type="button" :class="{
                'active': productStore.getExpandedCategoryIndex === mc.id && productStore.getExpandedInnerCategoryIndex === null,
                'disabled_filter': store.api_statuses.products === 'loading'
              }" :disabled="store.api_statuses.products === 'loading'"
                @click="handleCategoryClick(0, mc.label_ita, mc.label_eng, mc.id, index);">
                {{ store.language === 'ita' ? mc.label_ita : mc.label_eng }}

                <img :src="getChevronDirection(1, mc.id)" alt="chevron icon" loading="lazy"
                  v-if="mc.categories?.length > 0" />
              </button>

              <!-- Inner Category -->
              <transition name="slide-fade">
                <div v-show="productStore.breadcrumbs[0].parent_index === index">
                  <ul class="inner_cat">
                    <li v-for="(cat, ind) in mc.categories" :key="ind">

                      <!-- Inner Category Link -->
                      <a v-if="cat.sub_categories.length === 0" href="#" class="btn_dropdown_element" :class="{
                        'active': productStore.getExpandedInnerCategoryIndex === cat.id,
                        'disabled_filter': store.api_statuses.products === 'loading'
                      }"
                        @click.prevent="handleCategoryClick(1, cat.label_ita, cat.label_eng, cat.id, ind); closeDrop()">
                        {{ store.language === 'ita' ? cat.label_ita : cat.label_eng }}
                      </a>

                      <div v-else>
                        <!-- Inner Category Toggler -->
                        <button class="btn_dropdown_element" type="button" :class="{
                          'active': productStore.getExpandedInnerCategoryIndex === cat.id && productStore.getSubCategoryIndex === null,
                          'disabled_filter': store.api_statuses.products === 'loading'
                        }" :aria-expanded="productStore.getExpandedInnerCategoryIndex === ind ? 'true' : 'false'"
                          :disabled="store.api_statuses.products === 'loading'"
                          @click.prevent="handleCategoryClick(1, cat.label_ita, cat.label_eng, cat.id, ind)">
                          {{ store.language === 'ita' ? cat.label_ita : cat.label_eng }}

                          <img :src="getChevronDirection(2, cat.id)" alt="chevron icon" loading="lazy"
                            v-if="cat.sub_categories?.length > 0" />
                        </button>

                        <!-- Sub Category -->
                        <transition name="slide-fade">
                          <div v-show="productStore.breadcrumbs[1].parent_index === ind">
                            <ul class="sub_inner_cat">
                              <li v-for="(sub, id) in cat.sub_categories" :key="id">
                                <a href="#" class="btn_dropdown_element" :class="{
                                  'active': productStore.getSubCategoryIndex === sub.id,
                                  'disabled_filter': store.api_statuses.products === 'loading'
                                }"
                                  @click.prevent="handleCategoryClick(2, sub.label_ita, sub.label_eng, sub.id, ind); closeDrop()">
                                  {{ store.language === 'ita' ? sub.label_ita : sub.label_eng }}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </transition>
                      </div>
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </li>
        </ul>

        <!-- Placeholder -->
        <ul v-else>
          <li v-for="i of 6" :key="i" class="placeholder_filter">
            <CommonPlaceholder mode="md" />
            <CommonPlaceholder mode="btn" />
          </li>
        </ul>
      </transition>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
aside {
  border-radius: var(--border_radius);
  background-color: var(--secondary-color) !important;
  box-shadow: 0 0 8px -2px #484848c7;

  .placeholder_filter {
    @extend %fx_between_center;
    gap: .65rem;
    width: 100%;

    &>* {
      margin: .4rem 0;
    }
  }

  // Commons
  .header_filter_tab_container {
    @extend %fx_between_center;
    gap: 0.5rem;
    width: 100%;
    border-bottom: 0.5px solid white;
    margin-bottom: .75rem;

    .header_filter_tab {
      font-size: 1.1rem;
      font-weight: bold;
      color: white;
    }
  }

  img {
    width: 1rem;
    height: 1rem;
  }

  ul {
    margin-bottom: .4rem;

    &.inner_cat {
      padding-left: 1rem !important;
    }

    &.sub_inner_cat {
      padding-left: .85rem !important;
    }

    li {
      width: 100%;

      .btn_dropdown_element {
        @extend %fx_between_center;
        gap: 0.25rem;
        width: 100%;
        color: white;
        padding: 0.4rem;
        text-decoration: none;
        border-radius: var(--border_radius);
        border: 0;
        font-size: inherit;
        background: none;
        margin: .35rem 0;

        &:hover {
          background-color: var(--primary-color);
          color: var(--secondary-color) !important;
        }

        &:hover img {
          filter: invert(0) !important;
        }

        img {
          filter: invert(1);
          margin-right: .2rem;
        }
      }
    }
  }

  // Mobile Filter Menu
  &.aside_mobile {

    @media screen and (min-width: 992px) {
      display: none;
    }

    .header_filter_tab_container {
      padding: 1rem;

      .open_drop_btn {
        @extend %fx_center;
        width: 2rem;
        height: 2rem;
        border-radius: var(--border_radius);
        border: 0.1px solid rgba(189, 189, 189, 0.514);
        transition: all 0.2s ease-in-out;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .menu_wrapper {
      padding: .75rem !important;
    }
  }

  // Desktop Filter Menu
  &.aside_desktop {
    display: none;
    position: relative;
    margin-top: .75rem;
    flex-shrink: 0;

    @media screen and (min-width: 992px) {
      display: block;
    }

    .aside_cont {
      display: none;
      width: 280px;
      padding: 1rem;

      @media screen and (min-width: 992px) {
        display: block;
      }

      @media screen and (min-width: 1600px) {
        width: 350px;
      }

      @media screen and (min-width: 1800px) {
        width: 400px;
      }
    }

    .header_filter_tab_container {
      padding-bottom: .35rem;
      justify-content: start;
    }
  }

  // ********* Class status *********
  .active {
    background-color: rgb(255, 255, 255) !important;
    color: var(--secondary-color) !important;
    font-weight: bold !important;

    img {
      filter: invert(0) !important;
    }
  }

  .disabled_filter {
    cursor: progress !important;
    opacity: 0.7;
  }
}

button {
  cursor: pointer;
}

button[disabled].disabled_filter {
  cursor: progress !important;
  pointer-events: all;
}

// ********* Animation *********
.slide-fade-enter-active,
.slide-fade-leave-active {
  overflow: hidden;
  animation: slide 0.4s ease-in;
}

.slide-fade-enter,
.slide-fade-leave-to {
  animation: slide 0.3s ease-in reverse;
}

@keyframes slide {
  0% {
    max-height: 0;
    opacity: 0;
  }

  99% {
    max-height: 100px;
    opacity: 1;
  }

  100% {
    max-height: 100%;
  }
}
</style>