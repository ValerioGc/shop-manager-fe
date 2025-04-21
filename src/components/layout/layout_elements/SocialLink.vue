<script setup lang="ts">

import { ref } from 'vue';
import { global_store } from '@/stores/global_store';
import CommonPlaceholder from '@/components/utils_components/placeholders/CommonPlaceholder.vue';

const store = global_store();

const props = defineProps<{
  type: string;
}>();

// **************** Header social links image management ****************
const imageLoaded = ref<boolean[]>([]);
const handleImageLoad = (index: number): void => {
  imageLoaded.value[index] = true;
};

const imageError = ref<boolean[]>([]);
const handleImageError = (index: number): void => {
  imageError.value[index] = true;
};

/**
  * Manage the image loading in the header.
  * Show the image if it is loaded correctly.
  * @param index - The index of the contact
*/
const handleImageLoadFooter = (index: number): void => {
  if (store.console_debug) console.log('Image loaded for index:', index);

  const img = document.getElementById('link_container_img_' + index);
  if (img)
    (img as HTMLElement).style.display = 'block';

  const pl = document.getElementById('pl_' + index);
  if (pl)
    (pl as HTMLElement).style.display = 'none';
};

let remove_footer_count = 0;
const removedElements = new Set<string>();

/**
  * Manage the image loading in the foote and hide the element if the image is not loaded correctly.
  * @param id - The id of the contact
  * @param index - The index of the contact
  * @returns {void}
*/
const handleImageErrorFooter = (id: string, index: number): void => {
  if (store.console_debug) console.log('Image error for index:', index);
  if (!id) return;

  if (!removedElements.has(id)) {
    remove_footer_count++;
    removedElements.add(id);

    const li = document.getElementById('link_container_' + index);
    if (li) {
      li.classList.add('d_none');
    }

    if (remove_footer_count >= store.quick_contacts_list.length) {
      const section = document.getElementById('qk');
      if (section) {
        section.classList.add('d_none');
      }
    }
  }
};

</script>

<template>

  <!-- Header Horizontal social links -->
  <div v-if="props.type === 'h'">
    <ul class="social_cont_h">
      <li v-for="(contact, index) in store.quick_contacts_list" :key="index" :id="'link_container_h_' + index">
        <a :href="contact.link_value">
          <img v-if="contact.image_url" class="scale_in" :src="contact.image_url"
            :alt="store.language === 'ita' ? contact.label_ita : contact.label_eng + ' logo'"
            @load="handleImageLoad(index)" @error="handleImageError(contact.id)" />
          <div class="pl_wrapper" :id="'pl_' + index" v-else-if="store.api_contact_status === 'loading'">
            <CommonPlaceholder mode="box" />
          </div>
        </a>
      </li>
    </ul>
  </div>

  <!-- Footer Horizontal social links -->
  <ul v-else class="social_cont_f">
    <li v-for="(contact, index) in store.quick_contacts_list" :key="index" :id="'link_container_' + index">
      <a :href="contact.link_value" target="_blank">
        <img :id="'link_container_img_' + index" class="scale_in_instant" v-if="contact.image_url"
          :src="contact.image_url" :alt="store.language === 'ita' ? contact.label_ita : contact.label_eng + ' logo'"
          @load="handleImageLoadFooter(index)" @error="handleImageErrorFooter(contact.id, index)" />
        <div class="pl_wrapper" v-else-if="store.api_contact_status === 'loading'" :id="'pl_' + index">
          <CommonPlaceholder mode="box" />
        </div>
      </a>
    </li>
  </ul>

</template>

<style lang="scss" scoped>
.pl_wrapper {
  position: relative;
  display: block;

  &>* {
    border-radius: 5px;
  }
}

.social_cont_f {
  padding: 0;
  margin: 0;
  @extend %fx_center;
  flex-wrap: nowrap;

  @media screen and (min-width: 768px) {
    flex-wrap: wrap;
  }

  li {
    @extend %fx_center;
    position: relative;
    margin: 10px;
    height: 50px;
    width: 50px;

    border-radius: 4px;
    align-content: center;
    cursor: pointer;
    box-shadow: -1px -1px 5px rgba(26, 31, 171, 0.63) !important;
    border: 0.2px solid rgba(150, 150, 150, 0.98);
    overflow: hidden;

    @media screen and (min-width: 450px) {
      height: 70px;
      width: 70px;
    }

    &:hover {
      transition: linear all 0.2s;
      border-radius: var(--border_round);
      backdrop-filter: blur(5px);
    }
  }

  a {
    display: inline-block;

    .pl_wrapper {
      border-radius: 3px;
      width: 25px;
      height: 25px;
    }
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: none;

    @media screen and (min-width: 450px) {
      height: 35px;
      width: 35px;
    }
  }
}

.social_cont_h {
  @include flexmin(center, center, row, wrap, 1rem);
  margin: auto;
  margin-right: 1rem;

  @media screen and (min-width: 992px) {
    flex-direction: row-reverse;
  }

  li {
    list-style: none;

    a,
    img {
      display: block;
    }

    a {
      color: var(--secondary-color);
      font-size: 1.5rem;
    }

    .pl_wrapper,
    img {
      width: 2rem;
      height: 2rem;

      @media screen and (min-width: 380px) {
        width: 2.25rem;
        height: 2.25rem;
      }

      @media screen and (min-width: 992px) {
        width: 2.5rem;
        height: 2.5rem;
      }

      img:hover {
        transform: scale(1.2);
        transition: all 0.2s linear 0.5ms;
        cursor: pointer;
      }
    }
  }
}

// Animation for the social links
.scale_in_instant {
  animation: scale_in 1.5s 0s;
}

.scale_in {
  animation: scale_in 1.5s 0.6s;
}

@keyframes scale_in {
  0% {
    transform: scale(0.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>