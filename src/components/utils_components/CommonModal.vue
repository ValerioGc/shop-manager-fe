<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';

interface Props {
  images?: string[];
  currentImage: string;
  zoom?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  zoom: false,
});

const emit = defineEmits<{ (event: 'close'): void }>();

const isVisible = ref<boolean>(true);

const currentIndex = ref<number>(
  props.images && props.images.length > 0 ? props.images.indexOf(props.currentImage) : 0
);

watch(() => props.currentImage, (newImage: string) => {
  if (props.images && props.images.length > 0) {
    currentIndex.value = props.images.indexOf(newImage);
  }
});

// ************ BUTTONS ACTIONS ************
function closeModal(): void {
  isVisible.value = false;
  setTimeout(() => {
    emit('close');
    document.querySelector('body')?.classList.remove('ov_h');
  }, 500);
}

function nextImage(): void {
  if (props.images && props.images.length > 0) {
    if (currentIndex.value < props.images.length - 1) {
      currentIndex.value++;
    } else {
      currentIndex.value = 0;
    }
  }
}

function previousImage(): void {
  if (props.images && props.images.length > 0) {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    } else {
      currentIndex.value = props.images.length - 1;
    }
  }
}

/**
* Go to the selected image
* @param index  The index of the image to show
*/
function goToImage(index: number): void {
  currentIndex.value = index;
}

// Append the class 'ov_h' to the body to prevent scrolling on background
onMounted(() => {
  document.querySelector('body')?.classList.add('ov_h');
});

</script>

<template>
  <transition name="modal">
    <div v-if="isVisible" class="modal_overlay" @click.self="closeModal" aria-dialog="true" aria-modal="true"
      role="dialog" :aria-expanded="isVisible">

      <div class="close_btn_container">
        <button class="close_button" @click.prevent="closeModal">
          <img src="@/assets/icons/close.svg" alt="Close Modal" loading="lazy" />
        </button>
      </div>

      <button class="prev_button dk" @click.prevent="previousImage" v-if="props.images && props.images.length > 1">
        <img src="@/assets/icons/chevron-left.svg" alt="Previous Image" loading="lazy" />
      </button>

      <div class="modal_image_wrapper"
        :class="{ 'full_wr': props.zoom || !props.images || props.images && props.images.length === 0 }">
        <!-- Image -->
        <img v-if="props.images && props.images.length > 0" :src="props.images[currentIndex]" alt="Modal Image"
          class="modal_image" />
        <img v-else :src="props.currentImage" alt="Modal Image" class="modal_image" />
      </div>

      <button class="next_button dk" @click.prevent="nextImage" v-if="props.images && props.images.length > 1">
        <img src="@/assets/icons/chevron-right.svg" alt="Next Image" loading="lazy" />
      </button>

      <div class="bottom_controls" v-if="props.images && props.images.length > 1">
        <button class="prev_button mob" @click="previousImage">
          <img src="@/assets/icons/chevron-left.svg" alt="Previous Image" loading="lazy" />
        </button>

        <!-- Pagination Dots -->
        <ul class="pagination-dots" role="navigation" aria-label="Image Navigation">
          <li v-for="(image, index) in props.images" :key="index" class="pagination-dot"
            :class="{ 'active': index === currentIndex }" @click="goToImage(index)"></li>
        </ul>

        <button class="next_button mob" @click="nextImage">
          <img src="@/assets/icons/chevron-right.svg" alt="Next Image" loading="lazy" />
        </button>
      </div>
    </div>
  </transition>
</template>


<style lang="scss" scoped>
.full_wr,
.full_wr img {
  height: 100% !important;
  object-fit: contain;
}

.modal_overlay {
  @extend %full_page;
  @extend %fx_center;
  flex-direction: column;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  background-color: #000000cc;
  backdrop-filter: blur(8px);
  z-index: var(--z_max);
  padding: 2.65rem .45rem 0 .45rem;

  @media screen and (min-width: 580px) {
    padding: 2.65rem .65rem 0 .65rem;
  }

  @media screen and (min-width: 900px) {
    padding: 2.65rem;
    padding-bottom: 0;
  }

  .prev_button {
    left: 0;
  }

  .next_button {
    right: 0;
  }

  .prev_button.dk,
  .next_button.dk {
    display: none;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);

    @media screen and (min-width: 900px) {
      display: block;
    }
  }

  .close_btn_container {
    width: 100%;
    text-align: end;
    position: fixed;
    top: 0;
    right: 0;
    padding: .15rem;

    .close_button img {
      padding: .35rem .35rem 0 0;
      display: block;
    }
  }

  .close_button,
  .prev_button,
  .next_button {
    background: none;
    border: none;
    cursor: pointer;

    img {
      width: 1.75rem;
      height: 1.75rem;
      filter: invert(1);
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.7;
      }

      @media screen and (min-width: 900px) {
        width: 2.15rem;
        height: 2.15rem;
      }
    }
  }

  .modal_image_wrapper {
    align-content: center;
    overflow: auto;
    overflow-x: hidden;

    width: 100%;
    height: 100%;
    height: inherit;
    display: block;

    &::-webkit-scrollbar {
      display: block;
      width: 0.5rem;
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(203, 203, 203, 0.634);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-track {
      background-color: rgba(124, 124, 124, 0.493);
    }

    .modal_image {
      width: 100%;
      display: block;
    }
  }

  .bottom_controls {
    @extend %fx_center;
    gap: 1rem;
    height: 15%;
    width: 100%;
    padding: .15rem;

    @media screen and (min-width: 900px) {
      height: 10%;
    }

    .prev_button.mob,
    .next_button.mob {
      display: block;

      @media screen and (min-width: 900px) {
        display: none;
      }
    }

    .pagination-dots {
      @extend %fx_center;
      flex-wrap: wrap;

      @media screen and (max-width: 580px) {
        justify-content: center;
      }

      .pagination-dot {
        width: 12px;
        height: 12px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        margin: 5px;
        cursor: pointer;

        &:hover,
        &.active {
          background-color: white;
        }
      }
    }
  }
}

// ********** ANIMATION TRANSITION **********
.modal-leave-active {
  transition: opacity 0.5s;
}

.modal-enter-active {
  transition: opacity 1.8s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
