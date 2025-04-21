<script setup lang="ts">

  import { useRouter } from 'vue-router';
  import { product_settings_store } from '@/stores/product_settings_store';
  import { global_store } from '@/stores/global_store';

  const router = useRouter();
  const productStore = product_settings_store();
  const store = global_store();

  interface Breadcrumb {
    lvl: number;
    label_ita: string;
    label_eng: string;
    expandedIndex: number | null;
    parent_index: number | null;
  }

  /**
    * Truncate text to a maximum length
    * @param {string} text - The text to truncate
    * @param {number} maxLength - The maximum length of the text
    * @returns {string} - The truncated text
  */
  const maxBreadcrumbLength: number = 20;
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
    router.push({ query: { page: 1 } });
  }

  /**
    * Handle the click on a breadcrumb
    * @param {number} level - The level of the breadcrumb
    * @returns {void}
  */
  function handleBreadcrumbClick(level: number): void {
    if (store.api_statuses.products === 'loading') return;

    for (let i = level + 1; i < productStore.breadcrumbs.length; i++) 
      productStore.breadcrumbs[i] = { lvl: i, label_ita: '', label_eng: '', expandedIndex: null, parent_index: null } as Breadcrumb;
    
    productStore.saveSessionData();
  }

</script>

<template>
  <div class="breadcrumb_filter_container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb_filter">

        <!-- HOME -->
        <li class="breadcrumb_element" style="flex-shrink: 0;">
          <a href="#" :class="{'disabled_filter': store.api_statuses.products === 'loading'}" @click.prevent="reset()">
            <img src="@/assets/icons/house.svg" alt="home" class="icon" loading="lazy" />
          </a>
        </li>

        <!-- FIRST -->
        <li class="breadcrumb_element" v-if="productStore.breadcrumbs[0].label_ita || productStore.breadcrumbs[0].label_eng">
          <component :is="productStore.breadcrumbs[1].label_ita || productStore.breadcrumbs[1].label_eng? 'a' : 'span'" 
                    :class="{'disabled_filter': store.api_statuses.products === 'loading'}" href="#"
                    :title="store.language === 'eng' ? productStore.breadcrumbs[0].label_eng : productStore.breadcrumbs[0].label_ita"
                    @click.prevent="handleBreadcrumbClick(0)"
          >
            {{ truncateText(store.language === 'eng' ? productStore.breadcrumbs[0].label_eng : productStore.breadcrumbs[0].label_ita, maxBreadcrumbLength) }}
          </component>
        </li>

        <!-- SECOND -->
        <li class="breadcrumb_element" v-if="productStore.breadcrumbs[1].label_ita || productStore.breadcrumbs[1].label_eng">
          <component :is="productStore.breadcrumbs[2].label_ita || productStore.breadcrumbs[2].label_eng? 'a' : 'span'"
                    :class="{'disabled_filter': store.api_statuses.products === 'loading'}" href="#"
                    :title="store.language === 'eng' ? productStore.breadcrumbs[1].label_eng : productStore.breadcrumbs[1].label_ita"
                    @click.prevent="handleBreadcrumbClick(1)"
          >
            {{truncateText( store.language === 'eng' ? productStore.breadcrumbs[1].label_eng:productStore.breadcrumbs[1].label_ita, maxBreadcrumbLength) }}
          </component>
        </li>

        <!-- LAST -->
        <li class="breadcrumb_element" v-if="productStore.breadcrumbs[2].label_ita || productStore.breadcrumbs[2].label_eng">
          <span class="breadcrumb_element"
            :title="store.language === 'eng' ? productStore.breadcrumbs[2].label_eng : productStore.breadcrumbs[2].label_ita"
          >
            {{ truncateText(store.language === 'eng' ? productStore.breadcrumbs[2].label_eng:productStore.breadcrumbs[2].label_ita, maxBreadcrumbLength) }}
          </span>
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
      background-color:  rgb(248, 249, 250);

      .breadcrumb_element {
        display: flex;
        flex: auto;
        min-width: 0;
        max-width: fit-content;
        align-items: center;
        @extend %ellipsis_text;
        
        & span:last-child {
          color: var(--secondary-color)!important;
          font-weight: 600;
        }

        &:not(:first-child)::before {
          color: #212529d2;
          content: "/";
          font-weight: 600;
          font-size: 1.1rem;
          padding-right: .5rem;
          padding-left: .5rem;
        }

        a, span {
          @extend %ellipsis_text;
          color: #000!important;
          text-decoration-color: #000!important;
          opacity: .85;
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
