<script setup lang="ts">

import { onMounted } from 'vue';
import { global_store } from '@/stores/global_store';

import SectionTitle from '@/components/layout/layout_elements/SectionTitle.vue';
import CommonPlaceholder from '@/components/utils_components/placeholders/CommonPlaceholder.vue';


const store = global_store();

/**
  * Fetches the contacts from the API
  * @returns {void}
*/
async function getContacts(): Promise<void> {
  try {
    await store.apiDispatcher('/contact', 'contacts')
      .then((res) => {
        store.cached.contacts = res.data;
        if (store.console_debug) console.table(store.cached.contacts);
      });
  } catch (error) {
    store.cached.contacts = [];
    console.error(error);
  }
}

// ************ Style Management ************
function calculateStyle(index: number): string {
  return index % 2 !== 0 ? 'reverse' : '';
}

function calculateLastItemStyle(index: number): string {
  return store.cached.contacts.length &&
    store.cached.contacts.length % 2 !== 0 &&
    index === store.cached.contacts.length - 1
    ? 'full_half'
    : '';
}

onMounted(async () => {
  if (store.cached.contacts.length === 0)
    getContacts();
});

</script>

<template>
  <div class="contact_page_container">
    <div class="contact_container no_map_cont">

      <!-- Title and Description -->
      <div class="contact_header">
        <SectionTitle>
          <h1>{{ store.language === 'ita' ? store.config.titles.contactPageTitle.ita :
            store.config.titles.contactPageTitle.eng }}</h1>
        </SectionTitle>
        <p>{{ store.language === 'ita' ? store.config.text.contactPageText.ita : store.config.text.contactPageText.eng
        }}</p>
        <hr />
      </div>

      <!-- Contact List -->
      <ul class="contact_list no_map"
        v-if="store.api_statuses.contacts === 'success' && store.cached.contacts.length > 0">
        <li v-for="(c, index) in store.cached.contacts" :key="index" class="contact_link_li"
          :class="calculateLastItemStyle(index)">
          <a :aria-label="c.label_ita + ' link'" :href="c.link_value" target="_blank" class="contact_link"
            :class="calculateStyle(index)">
            <div class="contact_logo_container">
              <img :src="c.image_url" :alt="'logo ' + c.label_ita" class="contact_logo" />
            </div>
            <h2 class="contact_link_label" :title="store.language === 'ita' ? c.label_ita : c.label_eng">
              {{ store.language === 'ita' ? c.label_ita : c.label_eng }}
            </h2>
          </a>
        </li>
      </ul>

      <!-- Placeholder contact list -->
      <ul class="contact_list placeholder_list" v-else>
        <li class="contact_link_li" v-for="i of 6" :key="i">
          <CommonPlaceholder mode="btn" />
          <CommonPlaceholder mode="md" />
        </li>
      </ul>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.contact_page_container {
  @extend %full_wh;
  @extend %fx_center;
  flex-direction: column;

  .placeholder_list {
    padding: 0 1rem !important;

    .contact_link_li {
      @include flexmin(space-between, center, null, null, .75rem);

      &>* {
        text-align: center;
      }

      &:first-child,
      &:nth-child(2) {
        width: 100%;

        @media screen and (min-width: 720px) {
          width: 50% !important;
        }
      }
    }
  }

  @media (min-width: 920px) {
    @include flexmin(space-between, stretch, row, null, 1rem);
    margin: 0 auto 1rem auto;
    padding: 0 1rem 1rem;
  }

  @media (min-width: 1024px) {
    width: 95%;
  }

  @media (min-width: 1300px) {
    width: 85%;
  }

  @media (min-width: 1450px) {
    width: 80%;
  }

  @media (min-width: 1680px) {
    width: 75%;
  }

  .contact_container {
    @extend %full_wh;
    padding: 0 .5rem;
    margin: 0 auto;

    @media (min-width: 520px) {
      width: 90%;
      padding: 0 .75rem;
    }

    @media (min-width: 768px) {
      width: 80%;
      padding: 0 0.25rem 1rem;
    }

    @media (min-width: 920px) {
      width: 70%;
      padding: 0 0.5rem 1rem;
    }

    .contact_header {

      p {
        padding-bottom: 0.65rem;
      }
    }

    .contact_list {
      @include flexmin(center, center, column, wrap, 1.25rem);
      margin: auto;
      margin-top: 1.75rem;

      @media screen and (min-width: 380px) {
        width: 90%;
      }

      @media (min-width: 680px) {
        align-items: stretch;
        flex-direction: row;
        justify-content: space-between;
        flex-shrink: 0;
      }

      @media (min-width: 920px) {
        margin: 1.75rem auto;
      }

      .contact_link_li {
        width: 100%;
        overflow: hidden;
        animation: slide 1s linear;
        text-align: center;
        flex-shrink: 0;

        &:hover {
          opacity: 0.8;
        }

        &.full_half {
          width: 100%;
          justify-content: start;

          .contact_link {
            @media screen and (min-width: 720px) {
              justify-content: center;
            }
          }

          @media screen and (min-width: 680px) {
            text-align: start;
          }
        }

        &:first-child,
        &:nth-child(2) {
          width: 100%;
          text-align: start;

          @media (min-width: 1300px) {
            width: calc(50% - 0.8rem);
          }
        }

        &:first-child {
          @media (min-width: 1300px) {
            text-align: left;
          }
        }

        &:nth-child(2) {
          @media (min-width: 1300px) {
            text-align: right;
          }

          .contact_link {
            flex-direction: row !important;
            justify-content: start !important;

            @media screen and (min-width: 1300px) {
              justify-content: end !important;
              flex-direction: row-reverse !important;
            }
          }
        }

        @media (min-width: 720px) {
          width: calc(50% - 0.8rem);
        }

        .contact_link {
          @include flexmin(start, center, row, null, .3rem);
          @extend %full_wh;
          text-align: center;
          text-decoration: none;
          color: inherit;

          &.reverse {
            @media screen and (min-width: 720px) {
              flex-direction: row-reverse;
              justify-content: end;
            }
          }

          .contact_logo_container {
            @extend %fx_center;
            flex-shrink: 0;
            object-fit: fill;
            height: 40px;
            width: 50px;
            margin-right: 0.5rem;

            .contact_logo {
              @extend %full_wh;
            }
          }

          .contact_link_label {
            color: var(--secondary-color);
            width: 100%;
            text-align: start;

            @include text_overflow(0.9rem, 700, 1, null);

            &::first-letter {
              text-transform: uppercase !important;
            }

            @media screen and (min-width: 680px) {
              font-size: 1rem;
              width: unset !important;
            }

            @media screen and (min-width: 1300px) {
              font-size: 1.1rem;
            }
          }
        }
      }
    }

    .contact_list_placeholder {
      padding: 0;
      margin: auto 0;
      text-align: start !important;

      @media screen and (min-width: 450px) {
        text-align: center !important;
      }

      li {
        text-align: center !important;
      }

      .placeholder {
        border-radius: 3px;
      }
    }
  }
}

@keyframes slide {
  0% {
    max-height: 0;
    opacity: 0;
  }

  100% {
    max-height: 100%;
    opacity: 1;
  }
}
</style>