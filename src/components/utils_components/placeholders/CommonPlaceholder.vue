<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    mode: {
        type: String,
        required: true
    },
    align: {
        type: Boolean,
        default: false
    }
});

const ariaAttrs: Record<string, unknown> = {
    'aria-relevant': 'additions text',
    'aria-busy': true,
    'aria-live': 'polite' as 'polite' | 'off' | 'assertive',
    'aria-atomic': true
};

const isBox = computed(() => props.mode === 'box');

const textClass = computed(() => {
    const base = props.mode === 'lg'
        ? 'text_placeholder'
        : `text_placeholder ${props.mode}`;
    return props.align ? `${base} align` : base;
});
</script>

<template>
    <div v-if="!isBox" :class="textClass" v-bind="ariaAttrs"></div>
    <div v-else :class="['box wave', { align: props.align }]"></div>
</template>


<style lang="scss" scoped>
.align {
    margin: 0.25rem auto;
}

.text_placeholder {
    margin: .25rem 0;
    display: block;
    min-height: 1.1em;
    border-radius: 5px;
    cursor: wait;
    opacity: 0.75;
    background-color: #9b9b9b;
    width: 100%;
    mask-image: linear-gradient(130deg, #000 55%, #000000cc 75%, #000 95%);
    mask-size: 200% 100%;
    animation: wave 2s linear infinite;

    &.btn {
        width: 2rem;
        display: inline-block;
        background-color: #656565;
    }

    &.block {
        width: 5rem;
    }

    &.sm {
        width: 50%;
        min-height: 1.1em;
    }

    &.md {
        width: 75%;
    }

    &.xs {
        width: 25%;
    }
}

.box {
    @extend %full_wh;
    z-index: var(--z_2);
    background-color: rgb(145, 145, 145);
    position: absolute;
    top: 0;
    left: 0;
    animation: glow 2s ease-in-out infinite;
}

// ********** ANIMATIONS **********
.wave {
    mask-image: linear-gradient(140deg, #000 55%, rgba(0, 0, 0, 0.8) 75%, #000 95%);
    mask-size: 200% 100%;
    animation: wave 2s linear infinite;
}

@keyframes glow {
    50% {
        opacity: 0.2;
    }
}

@keyframes wave {
    100% {
        mask-position: -200% 0%;
    }
}
</style>