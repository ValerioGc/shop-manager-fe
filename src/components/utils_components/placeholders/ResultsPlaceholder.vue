<script setup lang="ts">

  import { global_store } from '@/stores/global_store';
  import { useRouter } from 'vue-router';

  const store = global_store();
  const router = useRouter();

  interface Props {
    refresh?: boolean;
    pl_text?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    refresh: false,
    pl_text: null
  });

</script>


<template>
  <div class="error_message_container">
    <p class="error_message">
      <img src="@/assets/icons/no-res.svg" alt="no result icon" loading="lazy" />
      <span>
        {{
          props.pl_text && props.pl_text.length 
          ? 
          props.pl_text 
          : 
          store.language === 'ita' ? 'Nessun prodotto disponibile' : 'No results' 
        }} 
      </span>
      </p>
      <button v-if="props.refresh"
              class="btn_e btn_primary error_message_button"
              @click.prevent="router.push('0')"  
        >
        <img src="@/assets/icons/refresh.svg" alt="refresh icon" loading="lazy" />
        <span>{{ store.language === 'ita' ? 'Ricarica' : 'Reload' }}</span>
      </button>
    </div>
</template>

<style lang="scss" scoped>

  .error_message_container {
    @extend %fx_center_between;
    flex-direction: column;
    width: 60%;
    min-height: 125px !important;
    margin: 2.5rem auto;
    padding: 1.25rem; 
    border: 0.3px solid #bababaaf;
    border-radius: var(--border_radius);
    background-color: #e5e5e5d4;
    box-shadow: 0 0 6px -2px #8a8a8a;
    text-align: center;

    .error_message {
      margin: 0;
      color: #4f4f4f;
      text-align: center;
      font-weight: bold;
      font-style: italic;

      span, img {
        vertical-align: middle;
      }

      img {
        width: 30px;
        height: 25px;

        @media screen and (min-width: 480px) {
          width: 35px;
          height: 30px;
        }
      }
    }

    .error_message_button {
      margin: 1.75rem auto 1rem;
      
      img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.35rem;
        filter: invert(1);
      }
      span {
        vertical-align: middle;
      }
    }
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
