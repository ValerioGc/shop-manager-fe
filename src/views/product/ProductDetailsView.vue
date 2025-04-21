<script setup lang="ts">

import { computed, onBeforeMount, ref } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter, type NavigationGuardNext, type RouteLocationNormalized } from "vue-router";
import { global_store } from "@/stores/global_store";

import ProductImages from "@/components/product/partials/ProductImages.vue";
import ImageModal from "@/components/utils_components/CommonModal.vue";
import CommonSpinner from "@/components/utils_components/placeholders/CommonSpinner.vue";
import CommonPlaceholder from "@/components/utils_components/placeholders/CommonPlaceholder.vue";
import arrow_left from "@/assets/icons/arrow-left.svg";
import { useHead } from '@vueuse/head';

const route = useRoute();
const store = global_store();
const router = useRouter();

/**
  * Get product details from API
  * @param route.params.id {numeric} - The product Id
  * @returns {void}
*/
async function getProduct(): Promise<void> {
    store.apiDispatcher('/product/get/' + route.params.id, "product_detail")
        .then((res) => {
            store.cached.product_detail = res.data;
            if (store.console_debug) console.table(store.cached.product_detail.value);
        });
}
const headConfig = computed(() => {
    if (store.cached.product_detail && Object.keys(store.cached.product_detail).length > 0) {
        const label = store.language === 'ita'
            ? store.cached.product_detail.label_ita
            : store.cached.product_detail.label_eng;
        const description = store.language === 'ita'
            ? store.cached.product_detail.description_ita
            : store.cached.product_detail.description_eng;
        return {
            title: label + ' | Shop Name',
            meta: [
                { name: 'description', content: String(description) },
                { property: 'og:title', content: String(label + ' | Shop Name') },
                { property: 'og:description', content: String(description) },
            ],
        };
    }
    return {};
});

useHead(headConfig);

// ************* Modal Management *************
const isModalOpen = ref<boolean>(false);
const modalCurrentImage = ref<string>('');
const modalImages = ref<string[]>([]);

/**
 * Open the modal with the selected image
 * @param imageUrl {string} - The url of the image to be displayed
 * @param images {string[]} - The array of images to be displayed in the modal
*/
function openModal(imageUrl: string, images: string[]): void {
    modalCurrentImage.value = imageUrl;
    modalImages.value = images;
    isModalOpen.value = true;
}

/**
  * Close the modal
*/
function closeModal(): void {
    isModalOpen.value = false;
}

onBeforeMount(async () => {
    const prodDetail = store.cached.product_detail;
    if (!prodDetail || Object.keys(prodDetail).length === 0 || route.params.id !== String((prodDetail).id))
        await getProduct();
});

onBeforeRouteLeave((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.name !== "product-details")
        store.cached.product_detail = {};

    next();
});

</script>


<template>
    <div class="item">

        <!-- Back button -->
        <div class="prod_breadcrumb_container">
            <div class="btn_back_container">
                <button class="btn_e btn_primary btn_back" @click="router.back();">
                    <img :src="arrow_left" alt="Back Icon" />
                    <span>{{ store.language === 'ita' ? 'Indietro' : 'Back' }}</span>
                </button>
            </div>

            <!-- Product title -->
        </div>

        <!-- Product title -->
        <div class="prod_title_container">
            <h1>
                <CommonPlaceholder mode="sm" v-if="store.api_statuses.product_detail === 'loading'" />
                <span v-else>
                    {{ store.language === 'ita' ? store.cached.product_detail.label_ita :
                        store.cached.product_detail.label_eng }}
                </span>
            </h1>
        </div>

        <!-- Product details container -->
        <div class="product_details_container" v-if="store.cached.product_detail != null">

            <!-- Product images -->
            <div v-if="store.api_statuses.product_detail === 'loading'" class="prod_image_container spin_plh">
                <CommonSpinner mode="spinner" size="md" class="img_size" />
            </div>

            <div class="prod_image_container"
                v-else-if="Array.isArray(store.cached.product_detail.images_url) && store.cached.product_detail.images_url.length">
                <ProductImages :initialImages="store.cached.product_detail.images_url" @open:modal="openModal" />
            </div>

            <div v-else class="prod_image_container no_res">
                <div class="img_size">

                    <img src="@/assets/icons/no-img-ico.svg" alt="Info Icon" loading="lazy" />
                    <p v-html="store.language === 'ita'
                        ? 'Fotografie non disponibili! <br/> Contattaci per richiedere le foto '
                        : 'Images not available!. <br/> Contact us to request the photos'">
                    </p>
                </div>
            </div>

            <!-- Product details -->
            <div class="prod">

                <div class="first_prod_section"
                    :class="store.api_statuses.product_detail === 'loading' ? 'loading_prod' : ''">
                    <p>
                        <span class="info_section">{{ store.language === 'ita' ? 'Prezzo' : 'Price' }}:</span>
                        <span
                            v-if="store.cached.product_detail.price !== null && store.api_statuses.product_detail !== 'loading'">
                            {{ store.cached.product_detail.price }}
                        </span>
                        <CommonPlaceholder mode="block" v-else-if="store.api_statuses.product_detail === 'loading'" />
                        <span v-else>-</span>
                    </p>

                    <p>
                        <span class="info_section">{{ store.language === 'ita' ? 'Codice' : 'Code' }}:</span>
                        <span
                            v-if="store.cached.product_detail.code !== null && store.api_statuses.product_detail !== 'loading'">
                            <em>{{ store.cached.product_detail.code }}</em>
                        </span>
                        <CommonPlaceholder mode="block" v-else-if="store.api_statuses.product_detail === 'loading'" />
                        <span v-else>
                            <em>{{ store.language === 'ita' ? 'Non disponibile' : 'Not available' }}</em>
                        </span>
                    </p>
                </div>
                <div class="first_prod_section"
                    :class="store.api_statuses.product_detail === 'loading' ? 'loading_prod' : ''">

                    <p>
                        <span class="info_section">{{ store.language == 'ita' ? 'Anno' : 'Year' }}:</span>
                        <span
                            v-if="store.cached.product_detail.year !== null && store.api_statuses.product_detail !== 'loading'">
                            {{ store.cached.product_detail.year }}
                        </span>
                        <CommonPlaceholder mode="block" v-else-if="store.api_statuses.product_detail === 'loading'" />
                        <span v-else>-</span>
                    </p>
                    <p>
                        <span class="info_section">{{ store.language === 'ita' ? 'Condizione' : 'Condition' }}:</span>
                        <span v-if="store.cached.product_detail.condition"
                            style="display: flex; align-items: center; flex-wrap: nowrap;">
                            <span class="prd_condition"
                                v-if="store.cached.product_detail.condition !== null && store.cached.product_detail.condition.label_ita !== null && store.api_statuses.product_detail !== 'loading'">
                                {{ store.language === 'ita' ?
                                    store.cached.product_detail.condition.label_ita :
                                    store.cached.product_detail.condition.label_eng }}
                            </span>
                            <div style="position: relative; margin-left: .25rem; width: 1.75rem; height: 1.75rem;"
                                v-if="store.cached.product_detail.condition.description_ita && store.cached.product_detail.condition.description_eng">
                                <img src="@/assets/icons/info.svg" :alt="store.language === 'ita' ? 'Info' : 'Info'"
                                    class="info_icon" loading="lazy" />

                                <span class="info_tooltip">
                                    {{ store.language === 'ita' ? store.cached.product_detail.condition.description_ita
                                        :
                                        store.cached.product_detail.condition.description_eng }}
                                </span>
                            </div>
                        </span>
                        <CommonPlaceholder mode="block" v-else-if="store.api_statuses.product_detail === 'loading'" />
                        <span v-else>-</span>
                    </p>
                </div>

                <div class="prd_description_container">

                    <p class="prd_description info_section">
                        {{ store.language === 'ita' ? 'Descrizione' : 'Description' }}
                    </p>

                    <hr />

                    <p
                        v-if="store.cached.product_detail.description_ita !== null && store.api_statuses.product_detail !== 'loading'">
                        {{ store.language ===
                            'ita' ? store.cached.product_detail.description_ita :
                            store.cached.product_detail.description_eng }}
                    </p>

                    <div v-else-if="store.api_statuses.product_detail === 'loading'"
                        class="product_description_placeholder">
                        <CommonPlaceholder mode="lg" v-for="i of 3" :key="i" />
                    </div>

                    <span v-else>
                        {{ store.language === 'ita' ? 'Nessuna descrizione per il prodotto'
                            : 'No description for the product' }}
                    </span>
                </div>
            </div>

        </div>

        <!-- Contact button -->
        <div class="contact_button">
            <button class="btn_e btn_primary" @click.prevent="router.push('/name/contacts')"
                :disabled="store.api_statuses.product_detail === 'loading'">
                {{ store.language === 'ita' ? 'Contattaci' : 'Contact us' }}
            </button>
        </div>

        <ImageModal v-if="isModalOpen" :images="modalImages" :current-image="modalCurrentImage" @close="closeModal" />
    </div>
</template>

<style lang="scss" scoped>
.info_tooltip {
    display: none;
    position: absolute;
    z-index: 1;
    background-color: var(--secondary-color);
    color: white;
    padding: .5rem;
    border-radius: .25rem;
    font-size: .9rem;
    box-shadow: 0 0 10px -3px #5e5e5e89;
    width: 400px;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    white-space: pre-wrap;
}

.info_icon {
    cursor: pointer;
    // width: 2rem;
    margin-left: .25rem;
}

.info_icon:hover+.info_tooltip {
    display: block;
}

.item {
    padding-top: .75rem !important;
    position: relative;

    .prod_breadcrumb_container {
        width: 92%;
        @extend %tx_center;
        @include flexmin(start, start, column, nowrap, .85rem);
        margin: .75rem auto 1.5rem;

        @media screen and (min-width: 480px) {
            flex-direction: row;
        }

        @media screen and (min-width: 768px) {
            gap: 1rem;
        }

        @media screen and (min-width: 920px) {
            gap: 1.5rem;
        }

        @media screen and (min-width: 1200px) {
            gap: 2rem;
        }


        &:deep(.breadcrumb_filter_container) {
            width: 100%;
            margin-top: 0;
        }

        &:deep(.breadcrumb_filter) {
            margin-bottom: 0;
            padding: .75rem;
        }

        // ********** Btn Back **********
        .btn_back_container {
            text-align: left;
            flex-shrink: 0;
            @extend %fx_center;

            .btn_back {
                padding: .6rem .65rem !important;

                img {
                    filter: invert(1);
                    margin-right: .35rem;

                    @media screen and (min-width: 480px) and (max-width: 680px) {
                        margin-right: 0;
                    }
                }

                span {
                    @media screen and (min-width: 480px) and (max-width: 680px) {
                        display: none;
                    }
                }
            }
        }
    }

    .prod_title_container {
        margin: 1.5rem auto !important;

        h1 {
            width: 100%;
            @extend %capitalize_start;
            @extend %tx_center;
            margin: 1rem auto;

            @media screen and (min-width: 768px) {
                width: calc(80% - 1rem);
            }

            &>* {
                margin: 1.5rem auto;
            }

            span {
                @extend %full_wh;
                display: block;
                word-wrap: break-word;
                font-size: 1.35rem;
                font-weight: bold !important;
                color: var(--secondary-color);
                text-rendering: optimizeSpeed;

                @media screen and (min-width: 480px) {
                    font-size: 1.45rem;
                }

                @media screen and (min-width: 680px) {
                    font-size: 1.65rem;
                }

                @media screen and (min-width: 768px) {
                    font-size: 1.85rem;
                }

                @media screen and (min-width: 920px) {
                    font-size: 2.15rem;
                }
            }
        }
    }

    // ************ Product Details Container ************
    .product_details_container {
        @extend %fx_center;
        @include flexmin(center, center, column, null, 1.5rem);
        padding: 0 .25rem;
        margin-bottom: 1.75rem;

        @media screen and (min-width: 320px) {
            padding: 0 1rem;
        }

        @media screen and (min-width: 920px) {
            flex-direction: row;
            justify-content: center;
            align-items: stretch;
        }

        // ************ Product Image Container ************
        .prod_image_container {
            max-width: 300px;
            flex-shrink: 0;

            @media screen and (min-width: 400px) {
                max-width: 380px;
            }

            @media screen and (min-width: 992px) {
                width: 50%;
                margin: 0;
            }

            .img_size {
                width: 100%;
                height: 360px;
                margin: 0 auto !important;
                text-align: center;
                align-content: center;
                background-color: rgb(225, 225, 225);
                box-shadow: 0 0 10px -3px #5e5e5e89;
                font-style: italic;

                img {
                    display: block;
                    padding: .35rem 0;
                    margin: 0 auto;
                    width: 50px;
                }
            }

            &.no_res {
                border-radius: var(--border_radius) !important;
                border: .4px solid lightgray;
                width: 350px;

                .img_size {
                    height: 250px;
                    border-radius: var(--border_radius) !important;

                    @media screen and (min-width: 920px) {
                        height: 100%;
                    }

                    img {
                        margin-bottom: 1rem !important;
                    }
                }
            }

            &.spin_plh {
                @extend %full_wh;
                align-content: center;
                border-radius: var(--border_radius) !important;
                border: .4px solid lightgray;

                .img_size {
                    border-radius: var(--border_radius) !important;
                }
            }

            P {
                width: 100%;
            }
        }

        // ************ Product Details ************
        .prod {
            @extend %full_width;
            padding: .5rem .75em;
            max-width: 720px;

            .info_section {
                font-weight: bold;
                padding-right: .25rem;
                font-size: 1.1rem;
                color: var(--secondary-color);
            }

            .first_prod_section {
                width: 100%;
                margin: 1.25rem 0;

                @media screen and (min-width: 520px) {
                    @include flexmin(space-between, center, null, wrap, 1rem);
                }

                &.loading_prod {
                    flex-wrap: nowrap !important;
                }

                p {
                    @include flexmin(space-between, center, null, wrap, .25rem);
                    font-size: 1.2rem;
                }

                .prd_condition {
                    @extend %capitalize_start;
                    display: block;
                }
            }

            .first_prod_section,
            .prd_description_container {
                @media screen and (min-width: 580px) {
                    width: 80%;
                    margin: 1.25rem auto;
                }

                @media screen and (min-width: 768px) {
                    width: 75%;
                }

                @media screen and (min-width: 920px) {
                    width: 100% !important;
                }
            }

            .prd_description_container {

                .info_section {
                    padding-left: 0;
                }

                .prd_description {
                    display: block;
                    margin-bottom: .5rem;

                    @media screen and (min-width: 420px) {
                        text-align: center;
                    }
                }

                .product_description_placeholder>* {
                    margin: .5rem 0;
                }
            }
        }
    }

    .text_placeholder {
        width: 10rem !important;
        display: inline-block;
    }

    // ************ Contact Button ************
    .contact_button {
        @extend %tx_center;
        margin: 3rem 2rem 2rem;
    }
}
</style>
