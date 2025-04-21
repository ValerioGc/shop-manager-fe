<script setup lang="ts">

import { useRouter } from 'vue-router';
import { product_settings_store } from '@/stores/product_settings_store';
import { global_store } from '@/stores/global_store';
import type { Category } from '@/types/entity/Category';

const router = useRouter();
const productStore = product_settings_store();
const store = global_store();


const props = defineProps<{
  breadcrumbs: Category[];
}>();

/**
  * Truncate text to a maximum length
  * @param {string} text - The text to truncate
  * @param {number} maxLength - The maximum length of the text
  * @returns {string} - The truncated text
*/
const maxBreadcrumbLength = 20;
function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength)
    return text.slice(0, maxLength) + '...';

  return text;
}

/**
  * Reset the breadcrumbs and the page query
  * @returns {void}
*/
function reset(): void {
  if (store.api_statuses.products === 'loading') return;

  productStore.resetBreadcrumbs();
  router.push({ name: 'products', query: { page: 1 } });
}

/**
  * Handle the click on a breadcrumb
  * @param {number} level - The level of the breadcrumb
  * @returns {void}
*/
function handleBreadcrumbClick(lvl: number, parentCategory: Category, category: Category | null, subCategory: Category | null): void {
  if (store.api_statuses.products === 'loading') return;

  if (lvl === 0) {
    productStore.setBreadcrumb(0, parentCategory.label_ita, parentCategory.label_eng, parentCategory.id, null);
  }
  else if (lvl === 1) {
    productStore.setBreadcrumb(0, parentCategory.label_ita, parentCategory.label_eng, parentCategory.id, null);

    if (category !== null)
      productStore.setBreadcrumb(1, category.label_ita, category.label_eng, category.id, null);
  }
  else if (lvl === 2) {
    productStore.setBreadcrumb(0, parentCategory.label_ita, parentCategory.label_eng, parentCategory.id, null);

    if (category !== null)
      productStore.setBreadcrumb(1, category.label_ita, category.label_eng, category.id, null);

    if (subCategory !== null)
      productStore.setBreadcrumb(2, subCategory.label_ita, subCategory.label_eng, subCategory.id, null);
  }

  router.push({ name: 'products', query: { page: 1 } });
}

</script>

<template>
  <div class="breadcrumb_filter_container" v-if="props.breadcrumbs.length > 0">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb_filter">

        <!-- HOME -->
        <li class="breadcrumb_element" style="flex-shrink: 0;">
          <a href="#" :class="{ 'disabled_filter': store.api_statuses.products === 'loading' }"
            @click.prevent="reset()">
            <img src="@/assets/icons/house.svg" alt="home" class="icon" loading="lazy" />
          </a>
        </li>

        <!-- FIRST -->
        <li class="breadcrumb_element" v-if="props.breadcrumbs[0].label_ita || props.breadcrumbs[0].label_eng">
          <a :class="{ 'disabled_filter': store.api_statuses.products === 'loading' }" href="#"
            :title="store.language === 'eng' ? props.breadcrumbs[0].label_eng : props.breadcrumbs[0].label_ita"
            @click.prevent="handleBreadcrumbClick(0, props.breadcrumbs[0], null, null)">
            {{ truncateText(store.language === 'eng' ? props.breadcrumbs[0].label_eng :
              props.breadcrumbs[0].label_ita, maxBreadcrumbLength) }}
          </a>
        </li>

        <!-- SECOND -->
        <li class="breadcrumb_element" v-if="props.breadcrumbs[1].label_ita || props.breadcrumbs[1].label_eng">
          <a :class="{ 'disabled_filter': store.api_statuses.products === 'loading' }" href="#"
            :title="store.language === 'eng' ? props.breadcrumbs[1].label_eng : props.breadcrumbs[1].label_ita"
            @click.prevent="handleBreadcrumbClick(1, props.breadcrumbs[0], props.breadcrumbs[1], null)">
            {{ truncateText(store.language === 'eng' ?
              props.breadcrumbs[1].label_eng : props.breadcrumbs[1].label_ita, maxBreadcrumbLength) }}
          </a>
        </li>

        <!-- LAST -->
        <li class="breadcrumb_element" v-if="props.breadcrumbs[2].label_ita || props.breadcrumbs[2].label_eng">
          <a href="#" :class="{ 'disabled_filter': store.api_statuses.products === 'loading' }"
            :title="store.language === 'eng' ? props.breadcrumbs[2].label_eng : props.breadcrumbs[2].label_ita"
            @click.prevent="handleBreadcrumbClick(2, props.breadcrumbs[0], props.breadcrumbs[1], props.breadcrumbs[2])">
            {{ truncateText(store.language === 'eng' ?
              props.breadcrumbs[2].label_eng : props.breadcrumbs[2].label_ita, maxBreadcrumbLength) }}
          </a>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb_filter_container {
  margin-top: .75rem;
  border-radius: var(--border_radius);
  box-shadow: 0 0 6px -2px #2a2a2ab9;

  .breadcrumb_filter {
    @include flexmin(flex-start, center, null, nowrap);
    overflow: hidden;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: rgb(248, 249, 250);

    .breadcrumb_element {
      display: flex;
      flex: auto;
      align-items: center;
      min-width: 0;
      max-width: fit-content;
      @extend %ellipsis_text;

      &:not(:first-child)::before {
        color: #212529d2;
        content: "/";
        font-weight: 600;
        font-size: 1.1rem;
        padding-right: .5rem;
        padding-left: .5rem;
      }

      a,
      span {
        @extend %ellipsis_text;
        color: #313131 !important;
        text-decoration-color: #000 !important;
        opacity: .85;

        &:hover {
          color: var(--secondary-color) !important;
        }
      }

      img {
        width: 17px;
        height: 24px;
        align-content: center;
        display: block;
      }

      span {
        display: inline-block;
        cursor: default;
      }
    }
  }
}

.disabled_filter {
  cursor: progress !important;
  opacity: 0.6;
}
</style>
