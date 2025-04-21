<script setup lang="ts">

import { global_store } from '@/stores/global_store';
import { computed } from 'vue';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

import CommonSpinner from '@/components/utils_components/placeholders/CommonSpinner.vue';

const store = global_store();

interface Breakpoint {
  itemsToShow: number;
  snapAlign: 'center' | 'start' | 'end' | 'center-even' | 'center-odd' | undefined;
}

/**
  * Breakpoints for the carousel
  * @type {Object}
  * @property {number} 620px - show 1.25 items
  * @property {number} 768px - show 2.25 items
  * @property {number} 920px - show 3 items
  * @property {number} 1120px - show 4.15 items
  * @property {number} 1200px - show 4.25 items
  * @property {number} 1300px - show 4.5 items
  * @property {number} 1400px - show 4.75 items
*/
const breakpoints: Record<number, Breakpoint> = {
  620: {
    itemsToShow: 1.25,
    snapAlign: 'center',
  },
  768: {
    itemsToShow: 2.25,
    snapAlign: 'center',
  },
  920: {
    itemsToShow: 2.5,
    snapAlign: 'center',
  },
  1120: {
    itemsToShow: 3,
    snapAlign: 'center',
  },
  1200: {
    itemsToShow: 3.25,
    snapAlign: 'center',
  },
  1300: {
    itemsToShow: 3.5,
    snapAlign: 'center',
  },
  1400: {
    itemsToShow: 4,
    snapAlign: 'center',
  }
};

const dynamicWrap = computed<boolean>(() => store.cached.show_new.length > 4);

/**
  * Format the dates for the carousel
  * @param {string} startDate - The start date
  * @param {string} endDate - The end date
  * @returns {string} The formatted date
*/
const formatDates = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const startDay = start.getDate();
  const startMonth = start.getMonth() + 1;
  const startYear = start.getFullYear();

  if (!end) {
    return `${startDay.toString().padStart(2, '0')}/${startMonth.toString().padStart(2, '0')}/${startYear}`;
  }
  else {
    const endDay = end.getDate();
    const endMonth = end.getMonth() + 1;
    const endYear = end.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      return `Dal ${startDay} al ${endDay}/${startMonth.toString().padStart(2, '0')}/${startYear}`;
    } else {
      return `Dal ${startDay.toString().padStart(2, '0')}/${startMonth.toString().padStart(2, '0')} al ${endDay.toString().padStart(2, '0')}/${endMonth.toString().padStart(2, '0')}/${endYear}`;
    }
  }
};

/**
  * Handle the click event on the carousel
  * @param {string} link - The link to redirect to
  * @returns {void}
*/
const handleClick = (link: string): void => {
  if (link) {
    window.open(link, '_blank');
  }
};

</script>

<template>

  <CommonSpinner :mode="'dots'"
    v-if="!store.cached.show_new && store.api_statuses.showN === 'loading' || store.cached.show_new && !store.cached.show_new.length && store.api_statuses.showN === 'loading'" />

  <Carousel v-else :itemsToShow="1" pause-autoplay-on-hover :wrapAround="dynamicWrap" :transition="500"
    :aria-label="store.language === 'ita' ? 'Carosello delle mostre' : 'Exhibitions carousel'"
    :aria-busy="store.api_statuses.showN === 'loading'" :breakpoints="breakpoints" :autoplay="4500" :i18n="{
      'ariaNextSlide': 'Prossima Slide',
      'ariaPreviousSlide': 'Slide Precedente',
      'itemXofY': '',
      'ariaNavigateToSlide': 'Navida alla slide n {slideNumber}',
      'iconArrowRight': 'Prossima Slide',
      'iconArrowLeft': 'Slide Precedente',
    }">
    <Slide v-for="(slide, index) in store.cached.show_new" :key="index">
      <div class="carousel_content" :class="{ 'clickable': slide.link }"
        @click.prevent="handleClick(slide.link as string)">
        <div class="carousel_image_container ">
          <img v-if="slide.image_url" :src="slide.image_url" alt="" class="carousel_image" />
          <img v-else src="@/assets/placeholders/calendar.svg" alt="" class="carousel_image" />
        </div>

        <div class="carousel_text_container">
          <h3 :title="slide.label_ita || slide.label_eng">{{ slide.label_ita || slide.label_eng }}</h3>
          <div class="info_section">
            <div class="carousel_date" :title="formatDates(slide.start_date, slide.end_date)">
              <img src="@/assets/icons/calendar.svg" alt="calendar icon" />
              <span v-if="slide.start_date">
                {{ formatDates(slide.start_date, slide.end_date) }}
              </span>
            </div>
            <span v-if="slide.location" class="carousel_location" :title="slide.location">
              <img src="@/assets/icons/map.svg" alt="map icon" loading="lazy" />
              {{ slide.location }}
            </span>
          </div>
        </div>
      </div>
    </Slide>

    <template #addons="{ slidesCount }">
      <Pagination v-if="slidesCount > 1" />
      <Navigation v-if="slidesCount > 1" />
    </template>
  </Carousel>
</template>

<style lang="scss">
.carousel {
  position: relative;
  text-align: center;
  box-sizing: border-box;
  touch-action: pan-y;
  overscroll-behavior: none;
}

.carousel__track {
  display: flex;
  padding: 1rem 0 !important;
  position: relative;
  transform-style: preserve-3d;
}

.carousel__viewport {
  overflow: hidden;
  perspective: 2000px;
}

//************** Navigation **************//
.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background: var(--secondary-color);
  box-shadow: 0 0 6px rgba(99, 99, 99, 0.346);
  border-radius: var(--border_radius);
  width: 35px;
  height: 35px;
  text-align: center;
  font-size: 1.2rem;
  padding: 0;
  color: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border: 0;
  cursor: pointer;
  margin: 0;
  top: 50%;
  border: 0.3px solid rgb(51, 51, 51);
  transform: translateY(-85%);

  &:hover {
    color: #65bfff95;
  }
}

.carousel__icon {
  width: 30px;
  height: 30px;
  fill: currentColor;
}

.carousel__next--disabled,
.carousel__prev--disabled {
  cursor: not-allowed !important;
}

.carousel__next--disabled,
.carousel__prev--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.carousel__prev {
  left: 0;

  @media screen and (min-width: 768px) {
    left: -0.5rem;
  }

  @media screen and (min-width: 920px) {
    left: -1rem;
  }
}

.carousel__next {
  right: 0;

  @media screen and (min-width: 768px) {
    right: -0.5rem;
  }

  @media screen and (min-width: 920px) {
    right: -1rem;
  }
}

.carousel--rtl .carousel__prev {
  left: auto;
  right: 0;
}

.carousel--rtl .carousel__next {
  right: auto;
  left: 0;
}

//************** Pagination **************//
.carousel__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  flex-wrap: wrap;
  line-height: 0;
  margin: 1.25rem 0 0 !important;
  padding: 0.5rem 0 !important;
}

.carousel__pagination-button {
  display: block;
  border: 0;
  margin: 0;
  cursor: pointer;
  padding: 6px;
  background: transparent;
}

.carousel__pagination-button::after {
  box-shadow: 0 0 7px -1px rgba(194, 206, 255, 0.699);
  border: 0.7px solid rgba(71, 108, 255, 0.709);
  display: block;
  content: '';
  width: 20px;
  height: 20px;
  background-color: rgb(186, 186, 186);
  border-radius: var(--border_round);
}

.carousel__pagination-button--active::after {
  background-color: var(--secondary-color);
}

.carousel__pagination-button--active {
  color: var(--secondary-color);
}

@media(hover: hover) {
  .carousel__pagination-button:hover::after {
    background-color: var(--secondary-color-light);
  }
}

//************** Slide **************//
.carousel__slide {
  scroll-snap-stop: auto;
  flex-shrink: 0;
  margin: 0;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  /* Fix iOS scrolling #22 */
  transform: translateZ(0);
  border-radius: var(--border_radius);
  padding: 5px;

  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide--active~.carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev,
.carousel__slide--next,
.carousel__slide--active {
  opacity: 1;
}

.carousel__slide--prev {
  transform: rotateY(-11deg) scale(0.9);
}

.carousel__slide--next {
  transform: rotateY(10deg) scale(0.9);
}

.carousel__slide--active {
  margin-left: 0 !important;
  transform: rotateY(0) scale(1);

  @media screen and (min-width: 768px) {
    margin-left: .5rem !important;
  }

  @media screen and (min-width: 1200px) {
    // restore the original scale and transformation
  }
}
</style>

<style lang="scss" scoped>
.carousel__next--disabled,
.carousel__prev--disabled {
  cursor: not-allowed !important;
}

.carousel_content {
  @extend %fx_center;

  border: 0.3px solid lightgray;
  border-radius: var(--border_radius);
  box-shadow: 0 0 6px rgba(99, 99, 99, 0.346);
  flex-direction: column;
  transition: filter 0.3s ease;

  &.clickable {
    cursor: pointer;

    &:hover {
      filter: brightness(0.8);
    }
  }
}

.carousel_image_container,
.carousel_text_container {
  @media screen and (min-width: 520px) {
    width: 310px;
  }

  @media screen and (min-width: 620px) {
    width: 360px;
  }

  @media screen and (min-width: 768px) {
    width: 220px;
  }
}

.carousel_image_container {
  @include border_radius('top', var(--border_radius));
  height: 120px;
  width: 280px;
  background-color: #e6e6e6;

  .carousel_image {
    @include border_radius('single', var(--border_radius), var(--border_radius));
    @extend %full_wh;
    object-fit: cover;
  }
}

.carousel_text_container {
  @include border_radius('bottom', var(--border_radius));
  height: 145px;
  width: 280px;
  padding: 0.75rem;
  background: #fcfcfc;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }

  h3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    white-space: normal;
    margin-bottom: .35rem;
    padding: 0 0.25rem;
    color: var(--secondary-color);
    text-shadow: 0 1px 1px #b9b9b94e;
    font-style: italic;
    font-weight: bold;
  }

  .info_section {
    @extend %ellipsis_text;
    text-align: center;

    .carousel_date,
    .carousel_location {
      @extend %ellipsis_text;
      display: block;
      max-width: 100%;
      padding-bottom: 0.25rem;
      opacity: .7;
    }

    .carousel_date {

      span,
      img {
        display: inline-block;
        vertical-align: middle;
      }

      img {
        margin-right: .35rem;
      }
    }
  }
}
</style>
