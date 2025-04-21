<script setup lang="ts">

  import { global_store } from '@/stores/global_store';
  import SocialLink from '@/components/layout/layout_elements/SocialLink.vue';

  const store = global_store();

</script>

<template>
  <footer>
      <div class="footer_wrapper">

        <!-- Quick Contacts Icons -->
        <div class="quick_contacts">
          <p>
            <em>
              {{ store.language === 'ita' ? store.config.titles.footerTitle.ita : store.config.titles.footerTitle.eng}}
            </em>
          </p>
          <hr />
          <SocialLink :type="'f'" />
        </div>

        <!-- Sub Footer Section -->
        <div class="sub_footer">
          <p class="signature"
            :title="
              store.language === 'ita'
                ? 'Tutte le immagini, i loghi e i marchi registrati appartengono ai legittimi proprietari. È vietato riprodurre il contenuto di questo sito senza autorizzazione.'
                : 'All images, logos and registered trademarks belong to their legitimate owners. Reproducing the content of this site without permission is prohibited.'
            "
          >
            &copy; {{ new Date().getFullYear() }} - 
              <em>
                {{ store.language === 'ita' ? store.config.text.footerText.ita : store.config.text.footerText.eng}}
              </em>
          </p>
        </div>
      </div>
  </footer>
</template>

<style lang="scss" scoped>

  footer {
    margin-top: 2rem;
    text-align: center;
    background-color: #f9f9f9;
    box-shadow: 0 2px 12px -7px #000000;

    .footer_wrapper {
      @extend %fx_center;
      flex-direction: column;
      width:100%;
      margin: auto;

      .quick_contacts {
        width: 100%;
        padding: 1.5rem 0;
        margin: 0 auto;
        text-align: center;

        @media screen and (min-width: 320px) {
          width: 85%;
        }

        @media screen and (min-width: 768px) {
          width: 65%;
          padding: 2rem 0;
        }

        @media screen and (min-width: 912px) {
          width: 45%;
        }

        p {
          font-weight: bold;
          font-size: 1.5rem;
        }

        hr {
          width: 75%;
          margin: 1rem auto;
          font-size: 1.25rem; 
        }
      }

      .sub_footer {
        width: 100%;
        padding: 1rem 0;
        margin-top: 1rem;
        background-color: #ebeaea;
        box-shadow: 0 -10px 8px #ebeaea;

        .signature, .signature em {
          text-align: center;
          font-weight: bold;        
        }
      }
    }
  }

</style>
