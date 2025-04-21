<script setup lang="ts">

    import { global_store } from '@/stores/global_store';
    import CommonSpinner from '@/components/utils_components/placeholders/CommonSpinner.vue';

    const store = global_store();

</script>

<template>
    <div class="loading_spinner">

        <img src="@/assets/logo.svg" alt="logo" loading="eager" />

        <p>
            {{ store.language === 'ita' ? 'Caricamento in corso' : 'Loading' }}
        </p>
        
        <CommonSpinner :mode="'dots'" />
    </div>
</template>

<style lang="scss" scoped>

    .loading_spinner {
        align-content: center;
        position: fixed;
        top: 0;
        left: 0;
        @extend %full_wh;
        width: 100vw;
        height: 100vh;
        text-align: center;
        background: rgba(255, 255, 255, 0.8);
        z-index: var(--z_max);

        img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 50%;
            max-width: 400px;
            height: auto;
        }

        p {
            font-weight: bold;
            font-size: 1.6rem;
            margin:2rem auto 1rem;
            color:var(--secondary-color);
        }
    }

</style>
