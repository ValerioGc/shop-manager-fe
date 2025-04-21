<script setup lang="ts">

import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { global_store } from '@/stores/global_store';

const store = global_store();
const router = useRouter();

const emit = defineEmits<{ (event: 'closeMenu'): void }>();

const searchInput = ref<string>('');
const isValid = ref<boolean>(true);

/**
* Set the title attribute for the search bar.
* @returns The title attribute for the search bar
*/
function setTitle(): string | undefined {
  if (!isValid.value) {
    return store.language === 'ita'
      ? 'Inserisci almeno 3 catatteri per cercare'
      : 'Insert at least 3 characters to search';
  }

  const btn = document.getElementById('search_btn');
  if (!btn || !btn.classList.contains('disabled')) {
    return;
  } else {
    return store.language === 'ita'
      ? 'Immetti del testo per cercare'
      : 'Insert some text to search';
  }
}

/**
* Validate the input value.
* @returns True if the input is valid, false otherwise
*/
const validate = (): boolean => {
  if (searchInput.value.length > 0 && searchInput.value.length < 3)
    return false;

  if (searchInput.value.length > 50)
    return false;

  return true;
};

/**
* Sanityze the SQL query string to prevent SQL injection.
* @param query - The query string to sanitize
* @returns The sanitized query string
*/
function sanitizeSQL(query: string): string {
  query = query.replace(/'/g, "''");
  query = query.replace(/(--|\/\*|\*\/|#)/g, '');

  const map: Record<string, string> = {
    '\\': '\\\\',
    '"': '\\"',
    '`': '\\`',
    '\x00': '\\x00',
    '\b': '\\b',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\x1a': '\\Z'
  };

  const reg = /[\\'"`\x00\b\n\r\t\x1a]/g; // Characters to escape

  return query.replace(reg, (match) => map[match] || '');
}

/**
* Search for products using the sanitized input.
*/
function searchProducts(): void {
  const input = document.querySelector('#search-bar') as HTMLElement | null;
  if (input)
    input.blur();

  if (includeCategory.value)
    router.push({ name: 'search', query: { text: sanitizeSQL(searchInput.value), category: 'true' } });
  else
    router.push({ name: 'search', query: { text: sanitizeSQL(searchInput.value), category: 'false' } });

  searchInput.value = '';
  emit('closeMenu');
  opVi.value = false;
}

const opVi = ref<boolean>(false);

/**
  * Watch for changes in the search input.
*/
watch(searchInput, () => {
  isValid.value = validate();
});

const includeCategory = ref<boolean>(false);

const hasFocus = ref(false);


</script>

<template>
  <div class="search_bar_container" @mouseenter="opVi = true" @mouseleave="opVi = false">
    <form class="src_bar" @submit.prevent="searchProducts" :title="setTitle()">
      <input class="form_ctl" :class="{ 'invalid': !isValid, 'art': hasFocus }" type="search" role="searchbox"
        @focus="hasFocus = true" @blur="hasFocus = false"
        :aria-description="store.language === 'ita' ? 'I risultati della ricerca verranno visualizzati qui sotto' : 'The search results will appear below'"
        v-model="searchInput" id="search-bar"
        :placeholder="store.language === 'ita' ? 'Cerca Prodotti' : 'Search Products'"
        :aria-label="store.language === 'ita' ? 'Cerca Prodotti' : 'Search Products'" />
      <button id="search_btn" class="btn_u" type="submit"
        :class="{ disabled: searchInput === '' || store.api_statuses.search === 'loading' || !isValid }"
        :disabled="searchInput === '' || store.api_statuses.search === 'loading' || !isValid" :title="setTitle()">
        <img src="@/assets/icons/search.svg" alt="search icon" class="icon" loading="lazy" />
      </button>

    </form>
  </div>
</template>

<style lang="scss" scoped>
// ********** Transition **********


.search_bar_container {
  border-radius: var(--border_radius);
  box-shadow: 0 0.5rem 0.8rem rgba(0, 0, 0, 0.15);
  position: relative;

  .src_bar {
    display: flex;
    outline-offset: -2px;

    .btn_u {
      position: relative;
      z-index: var(--z_2);
      margin-left: calc(var(--bs-border-width)* -1);
      @include border_radius('right', var(--border_radius));
      padding: .25rem .45rem;
      border: .1rem solid #d4d4d4c0;
      background-color: var(--secondary-color);
      border-left: 0;
      line-height: 1.5;
      text-align: center;

      &.disabled {
        cursor: not-allowed;
        filter: opacity(0.8);
      }

      &:not(.disabled) {
        cursor: pointer;
      }

      &:hover:not(.disabled) {
        background-color: var(--secondary-color);
      }

      img {
        width: 1.7rem;
        height: 100%;
        filter: invert(1);
      }
    }

    .form_ctl {
      width: 100%;
      display: block;
      padding: 0.375rem 0.75rem;
      border: 0.1rem solid #d4d4d4c0;
      @include border_radius('left', var(--border_radius));
      background-clip: padding-box;
      transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
      font-size: 1.15rem;

      &:focus,
      &:active,
      &:focus-visible {
        outline: 0;
        box-shadow: 0 0 0 0.1rem #273ba640;

        &.invalid:focus {
          box-shadow: 0 0 0 .1rem #910b0b8e !important;
        }
      }
    }
  }
}
</style>
