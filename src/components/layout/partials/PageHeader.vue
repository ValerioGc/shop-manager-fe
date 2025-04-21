<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { global_store } from '@/stores/global_store';

import SearchBar from '@/components/layout/layout_elements/CommonSearchBar.vue';
import SocialLink from '@/components/layout/layout_elements/SocialLink.vue';
import LanguageSelectorDrop from '@/components/layout/layout_elements/CommonLanguageSelector.vue';

import logo from '@/assets/logo.svg';

const store = global_store();
const route = useRoute();

const props = defineProps<{ clMod: boolean }>();

// ************ Dropdown Management ************
const isDropdownVisible = ref<boolean>(false);
const isMobile = ref<boolean>(window.innerWidth < 992);
const isNavbarFixed = ref<boolean>(false);

/**
* Update the overlay visibility based on the dropdown visibility.
*/
function updateOverlay(): void {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.style.display = isDropdownVisible.value ? 'block' : 'none';
}

/**
* Watch the clMod prop to close the dropdown when the modal is visible.
*/
watch(() => props.clMod, (newVal: boolean) => {
  if (newVal)
    isDropdownVisible.value = false;

  updateOverlay();
}
);

interface Page {
  label?: string;
  name?: string;
}

/**
* Update the overlay visibility based on the dropdown visibility.
*/
function isActive(page: Page): boolean {
  const routeName = route.name ? String(route.name).toLowerCase() : '';
  const pageLabel = page.label ? page.label.toLowerCase() : '';
  const pageName = page.name ? page.name.toLowerCase() : '';
  return routeName === pageLabel || routeName === pageName;
}

/**
* Toggle the dropdown visibility.
*/
function toggleDropdown(): void {
  if (isMobile.value)
    isDropdownVisible.value = !isDropdownVisible.value;

  updateOverlay();
}

/**
* Watch the route name to close the dropdown in mobile mode.
*/
watch(() => route.name, () => {
  if (isMobile.value)
    isDropdownVisible.value = false;

  updateOverlay();
}
);

/**
* Manage the resize event to set the mobile mode.
*/
const handleResize = (): void => {
  isMobile.value = window.innerWidth < 992;
  if (!isMobile.value) {
    isDropdownVisible.value = false;
  }
  updateOverlay();
};

/**
* Manage the scroll event to fix the navbar.
*/
const handleScroll = (): void => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const headerContainer = document.querySelector('.header_container') as HTMLElement | null;
  if (headerContainer) {
    const headerHeight = headerContainer.offsetHeight;
    isNavbarFixed.value = scrollTop >= headerHeight;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <header role="banner">
    <!-- Header Logo -->
    <div class="header_container">
      <RouterLink to="/" class="page_logo">
        <img :src="logo" alt="Shop name business logo" aria-roledescription="logo" loading="eager" />
      </RouterLink>
    </div>

    <!-- Navbar -->
    <nav :class="['header_navbar', { 'navbar_fixed': isNavbarFixed }]" role="navigation">
      <!-- Mobile view -->
      <div class="navbar_mobile">
        <div class="navbar_mobile_link">
          <SocialLink :type="'h'" class="show_mobile" />
        </div>
        <button id="hamburger_toggler_icon" :class="{ 'open': isDropdownVisible }" type="button" aria-expanded="false"
          aria-label="Toggle navigation" @click.prevent="toggleDropdown">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="navbar_dropdown" v-if="isDropdownVisible || !isMobile">
        <div class="mobile_function">
          <SearchBar style="width:70%" @closeMenu="isDropdownVisible = false; updateOverlay()" />
          <LanguageSelectorDrop @closeMenu="isDropdownVisible = false; updateOverlay()" />
        </div>

        <!-- Nav Links -->
        <ul class="navbar_dropdown_list" :aria-expanded="isDropdownVisible">
          <li v-for="(page, index) in store.routes" :key="index" class="nav_list_element"
            :class="{ 'active': isActive(page) }">
            <RouterLink :to="page.route" class="nav_link" aria-current="page"
              @click.prevent="isDropdownVisible = false; updateOverlay()">
              {{ store.language === 'ita' ? page.name : page.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Desktop Social Link -->
      <SocialLink :type="'h'" class="show_desktop" />

      <!-- Desktop Functions -->
      <div class="desktop_function">
        <SearchBar @closeMenu="isDropdownVisible = false; updateOverlay()" />
        <LanguageSelectorDrop @closeMenu="isDropdownVisible = false; updateOverlay()" />
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
// ************ Header Logo ************
.header_container {
  @extend %fx_center;
  position: relative;
  padding: 1.25rem 2rem;
  z-index: var(--z_3);
  background-color: #f1fbff;
  box-shadow: -1px -1px 10px 0 rgba(124, 124, 124, 0.81);

  // ************ Background Image ************
  background-image: url('@/assets/decorations/clouds.svg');
  background-position-y: bottom;
  background-position-x: center;
  background-size: 130%;
  background-repeat: no-repeat;

  @media screen and (min-width: 420px) {
    background-size: 100%;
  }

  @media screen and (min-width: 728px) {
    padding: 2rem 5rem;
  }

  @media screen and (min-width: 920px) {
    background-size: 70%;
  }

  .page_logo img {
    width: 280px;
    height: 100px;

    @media screen and (min-width: 450px) {
      width: 360px;
      height: 125px;
    }

    @media screen and (min-width: 1200px) {
      width: 420px;
      height: 145px;
    }
  }
}

// ************ Navbar Mobile ************
.navbar_mobile {
  @extend %fx_between_center;
  width: 100%;
  padding: 0.75rem 0.6rem;

  @media screen and (min-width: 992px) {
    display: none;
  }

  .navbar_mobile_link {
    padding-top: 0.3125rem;
    margin-right: 1rem;
    font-size: 1.25rem;
    color: rgb(33, 37, 41);
    text-decoration: none;
    white-space: nowrap;
  }

  // ************ Mobile Hamburger Icon ************
  #hamburger_toggler_icon {
    position: relative;
    transform: rotate(0deg);
    padding: .35rem;
    transition: all .5s ease-in-out, padding 0s;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    border: 0.1px solid var(--secondary-color);
    box-shadow: 0 0 6px -1px var(--shadow-color);
    border-radius: var(--border_radius);

    @media screen and (min-width: 992px) {
      display: none;
    }

    &:hover {
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
      opacity: 0.8;
      scale: 1.05;
    }

    &.open {
      padding: 0;

      span:nth-child(1),
      span:nth-child(2),
      span:nth-child(3) {
        width: 80%;
      }

      span:nth-child(1) {
        transform: rotate(45deg) translate(4px, -8px);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: rotate(-45deg) translate(4px, 8px);
      }
    }

    span {
      display: block;
      height: 4px;
      width: 100%;
      background: var(--secondary-color);
      border-radius: 9px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: transform .25s ease-in-out;

      &:nth-child(1) {
        transform-origin: left center;
        margin-bottom: 0.25rem;
      }

      &:nth-child(2) {
        transform-origin: left center;
        margin-bottom: 0.25rem;
      }

      &:nth-child(3) {
        transform-origin: left center;
      }
    }
  }
}

.header_navbar {
  @extend %fx_between_center;
  flex-wrap: wrap;
  width: 100%;
  position: absolute;
  padding: 0;
  box-shadow: 0 1px 10px -3px #aaaaaa !important;
  border: 0.1px solid rgb(146, 146, 146, 0.627);
  background-color: #f8f9fa !important;
  z-index: var(--z_3);

  @media screen and (min-width: 992px) {
    padding: 1rem;
  }

  &.navbar_fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z_3);
    /* Fissa la navbar sopra tutti gli elementi */
    background-color: #f8f9fa;
    /* Mantiene il colore di sfondo */
    box-shadow: 0 0 10px -3px #aaaaaa !important;
  }

  .desktop_function {
    display: none;

    @media screen and (min-width: 992px) {
      @include flexmin(center, center, null, null, 1rem);
    }
  }

}

.navbar_dropdown {
  flex-basis: 100%;
  flex-grow: 1;
  align-items: center;
  animation: slide 0.75s linear;

  @media (min-width: 992px) {
    display: flex !important;
    flex-basis: auto;
  }

  .mobile_function {
    @include flexmin(space-around, center, null, wrap, .5rem);
    padding-top: 0;
    padding-bottom: 0;
    margin: 1rem auto;

    @media screen and (min-width: 992px) {
      padding-top: 0.5px;
      display: none !important;
    }
  }

  .navbar_dropdown_list {
    margin-right: auto;
    margin-bottom: 0.5rem;
    margin-top: 0.1rem;
    text-align: center;

    @media screen and (min-width: 992px) {
      margin-bottom: 0;
      flex-direction: row;
      display: flex;
    }

    .nav_list_element {
      font-weight: bold;

      &.active .nav_link {
        color: #f8f9fa !important;
        background-color: #273ba6 !important;
        border-radius: var(--border_radius);
        box-shadow: 0 0 4px -2px rgba(87, 86, 86, 0.62);
      }

      .nav_link {
        color: #273ba6;
        transition: linear all 0.2s;
        display: block;
        padding: 0.5rem;
        font-weight: bold;
        text-decoration: none;
        margin: 0.1rem;
        background: 0 0;
        border: 0;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out;

        &:hover {
          color: #f8f9fa;
          background-color: #273aa6ad;
          border-radius: var(--border_radius);
          box-shadow: 0 0 4px -2px rgba(87, 86, 86, 0.62);
          text-decoration: none;
        }
      }
    }
  }
}

// ************ Media Visibility social link Queries ************
.show_mobile {
  @include mq_visibility('mobile', flex, 992px);
}

.show_desktop {
  @include mq_visibility('desktop', flex, 992px);
}

// ************ Animations ************
.slide-fade-enter,
.slide-fade-enter-active {
  @media screen and (min-width: 990px) {
    overflow: hidden;
    animation: slide 0.75s linear;
  }
}

@keyframes slide {
  0% {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }

  100% {
    opacity: 1;
    max-height: 100%;
  }
}
</style>
