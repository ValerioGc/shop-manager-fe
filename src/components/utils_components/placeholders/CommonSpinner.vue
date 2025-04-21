<script setup lang="ts">

    interface Props {
        mode: string;
        size?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        size: 'md'
    });

</script>


<template>
    
    <!-- Spinner -->
    <div class="spinner_container" v-if="props.mode === 'spinner' || props.mode === 'loader'">
        <div :class="{'sm': props.size === 'sm', 'loader':props.mode === 'loader', 'spinner_custom':props.mode === 'spinner' }"></div>
    </div>

    <!-- Dots -->
    <div v-else-if="props.mode === 'dots'">
        <div class="loading">
            <span class="loading_dot" v-for="i in 3" :key="i"></span>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    // ********* SPINNER *********
    .spinner_container {
        text-align: center;
        
        .spinner_custom:not(.sm) {
            width: 45px;
            height: 45px;
            background: conic-gradient(#0000 10%, var(--secondary-color)) content-box;
        }
        .spinner_custom {
            margin: auto;
            border-radius: var(--border_round);
            padding: 1.1px;
            mask-composite: intersect;
            animation: spin 1s infinite steps(10);
        }

        .loader {
            padding: 8px;
            aspect-ratio: 1;
            border-radius: var(--border_round);
            background: #25b09b;
            mask: conic-gradient(#0000 10%,#000),linear-gradient(#000 0 0) content-box;      
            mask-composite: subtract;
            animation: l3 1s infinite linear;
        }

        @keyframes l3 {to{transform: rotate(1turn)}}
        
        .sm {
            width: 19px;
            height: 19px;
            background: conic-gradient(#0000 10%, white), content-box;
        }
    }

    @keyframes spin {
        to { transform: rotate(1turn); }
    }

    // ********* DOTS *********
    .loading {
        @extend %fx_center;
        @extend %full_wh;
        padding: 2rem;

        .loading_dot {
            border-radius: var(--border_round); 
            animation: dot 1s ease-in-out infinite;
            background-color: grey;
            display: block;
            height: 1rem;
            width: 1rem;
            margin: 0 0.75rem;
        }

        .loading_dot:nth-of-type(2) {
            animation-delay: 0.2s;
        }

        .loading_dot:nth-of-type(3) {
            animation-delay: 0.4s;
        }

    }

    @keyframes dot {
        0%, 100% { 
            background-color: var(--secondary-color); 
            transform: scale(1); 
        }
        50% { 
            background-color: var(--secondary-color-light); 
            transform: scale(1.3); 
        }
    }

</style>
