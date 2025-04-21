<script setup lang="ts">

import { global_store } from '@/stores/global_store';
import { onMounted, ref, defineAsyncComponent } from 'vue';

import SectionTitle from '@/components/layout/layout_elements/SectionTitle.vue';
import ShowPageDescription from '@/components/show/ShowPageDescription.vue';
import ShowCarousel from '@/components/show/ShowCarousel.vue';
import ShowList from '@/components/show/ShowList.vue';

const CommonModal = defineAsyncComponent(() => import('@/components/utils_components/CommonModal.vue'));
const ResultsPlaceholder = defineAsyncComponent(() => import('@/components/utils_components/placeholders/ResultsPlaceholder.vue'));

const store = global_store();

/**
  * Fetches the new shows from the API
  * @returns {void}
*/
function getShows(): void {
  try {
    store.apiDispatcher('/show/new', 'showN')
      .then((res) => {
        store.cached.show_new = res.data;
      });
  } catch (error) {
    store.cached.show_new = [];
    console.error(error);
  }
}

// ************ Modal Management ************
const modalStatus = ref<string>('idle');
const isModalOpen = ref<boolean>(false);
const modalCurrentImage = store.config.settings.showPageImg || '';

function openModal(): void {
  if (modalStatus.value === 'loading') return;
  modalStatus.value = 'loading';
  isModalOpen.value = true;
}

function closeModal(): void {
  isModalOpen.value = false;
  modalStatus.value = 'idle';
}

onMounted(async () => {
  if (!store.cached.show_new || store.cached.show_new.length === 0) {
    getShows();
  }
});

</script>

<template>
  <div class="show_view">

    <CommonModal v-if="isModalOpen" :current-image="modalCurrentImage" :zoom="true" @close="closeModal" />

    <!-- SHOWS AND EXHIBITIONS HEADER -->
    <section>
      <SectionTitle class="first_section">
        <h1>
          {{ store.language === 'ita' ? store.config.titles.showPageTitle.ita : store.config.titles.showPageTitle.eng }}
        </h1>
      </SectionTitle>

      <ShowPageDescription @openModal="openModal" />
    </section>

    <!-- NEW SHOWS -->
    <section>
      <SectionTitle>
        <h2 class="section-title">
          {{ store.language === 'ita' ? 'Prossime Fiere' : 'Next Shows' }}
        </h2>
      </SectionTitle>
      <p class="section_test" v-if="store.config.text.showNextPageText.ita || store.config.text.showNextPageText.eng">
        {{
          store.language === 'ita' ? store.config.text.showNextPageText.ita : store.config.text.showNextPageText.eng
        }}
      </p>

      <ShowCarousel
        v-if="store.api_statuses.showN === 'loading' || store.cached.show_new && store.cached.show_new.length > 0" />
      <ResultsPlaceholder :refresh="false" v-else
        :pl_text="store.language === 'ita' ? 'Nessuna fiera in programma' : 'No shows scheduled'" />
    </section>

    <!-- OLD SHOWS -->
    <section>
      <SectionTitle>
        <h2 class="section-title">
          {{ store.language === 'ita' ? 'Fiere Passate' : 'Old Shows' }}
        </h2>
      </SectionTitle>

      <p class="section_test">{{ store.language === 'ita' ? store.config.text.showOldPageText.ita :
        store.config.text.showOldPageText.ita }} </p>

      <ShowList />

    </section>
  </div>
</template>

<style lang="scss" scoped>
.show_view {
  @extend %full_wh;
  padding: .75rem;

  @media screen and (min-width: 768px) {
    width: 80%;
    margin: 0 auto;
  }

  h1 {
    font-size: 2rem !important;
  }

  h2 {
    margin: 0
  }

  .first_section {
    text-align: center;
  }

  .section_test {
    padding-bottom: 1.5rem;
  }
}
</style>
