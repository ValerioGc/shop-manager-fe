<script setup lang="ts">

import { computed, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { global_store } from "@/stores/global_store";

import type { Show } from "@/types/entity/Show";
import SectionTitle from "@/components/layout/layout_elements/SectionTitle.vue";
import CommonSpinner from "@/components/utils_components/placeholders/CommonSpinner.vue";
import CommonPlaceholder from "@/components/utils_components/placeholders/CommonPlaceholder.vue";
import ImageModal from "@/components/utils_components/CommonModal.vue";

import arrow_left from "@/assets/icons/arrow-left.svg";
import { useHead } from "@vueuse/head";

const store = global_store();
const route = useRoute();
const router = useRouter();

const id = ref(route.params.id as string);
const show_detail = ref<Show>({} as Show);

/**
  * Get Show details from the API
  * @returns {void}
*/
async function getShow(): Promise<void> {
    if (!id.value) {
        router.go(-1);
        return;
    }

    try {
        await store.apiDispatcher(`/show/get/${id.value}`, "show")
            .then((res) => {
                show_detail.value = res.data;

            });
    } catch (error) {
        show_detail.value = {} as Show;
        console.error(error);
    }
}

// *************** Modal Management ***************
const modalCurrentImage = ref<string>('');
const modalImages = ref<string[]>([]);
const isModalOpen = ref<boolean>(false);

/**
  * Open the modal with the selected image
  * @param {string} imageUrl - The url of the image to be displayed
  * @param {string[]} images - The array of images to be displayed in the modal
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

const headSeoMeta = computed(() => {
    if (show_detail.value) {
        const titleText = store.language === "ita" ? show_detail.value.label_ita : show_detail.value.label_eng;
        return {
            title: titleText + " | Shop Name",
            meta: [
                {
                    name: "og:title",
                    content: titleText + " | Shop Name",
                },
            ],
        };
    }
    return {};
});

useHead(headSeoMeta);

onBeforeMount(() => {
    getShow();
});

</script>

<template>
    <div>
        <!-- Back Button -->
        <div class="btn_back_container">
            <button class="btn_e btn_primary" @click="router.back();">
                <img :src="arrow_left" alt="Back Icon" loading="eager" />
                <span>{{ store.language === 'ita' ? 'Indietro' : 'Back' }}</span>
            </button>
        </div>

        <!-- Image Modal -->
        <ImageModal v-if="isModalOpen" :images="show_detail.images_url" :current-image="modalCurrentImage" :zoom="true"
            @close="closeModal" />

        <!-- Show Details -->
        <div class="show_details_container">

            <div>
                <div class="maim_v">

                    <div class="image_container main_image"
                        v-if="show_detail.image_url || store.api_statuses.show === 'loading'">
                        <CommonSpinner mode="spinner" size="lg" v-if="store.api_statuses.show === 'loading'" />
                        <img v-else-if="show_detail.image_url" :src="show_detail.image_url"
                            :alt="store.language === 'ita' ? 'Copertina ' + show_detail.label_ita : 'Cover ' + show_detail.label_eng" />
                    </div>

                    <div class="image_container" v-else>
                        <img src="@/assets/placeholders/phl.svg" alt="placeholder image" loading="lazy" />
                    </div>

                    <div class="show_details_description">
                        <div>
                            <h1>
                                <CommonPlaceholder v-if="store.api_statuses.show === 'loading'" mode="sm" />
                                <span v-else>
                                    {{ show_detail.label_ita }}
                                </span>
                            </h1>

                            <div class="pl" v-if="store.api_statuses.show === 'loading'">
                                <CommonPlaceholder mode="xs" class="pl" />
                            </div>
                            <p v-else>
                                <img v-if="show_detail.start_date" src="@/assets/icons/calendar.svg" alt="Date Icon"
                                    loading="eager" />
                                {{ show_detail.start_date }}
                            </p>

                            <CommonPlaceholder v-if="store.api_statuses.show === 'loading'" mode="xs" />
                            <p v-else>
                                <img v-if="show_detail.location" src="@/assets/icons/map.svg" alt="Map Icon"
                                    loading="lazy" />
                                <span v-if="show_detail.location" class="location">
                                    {{ show_detail.location }}
                                </span>
                            </p>
                        </div>

                        <div class="show_btn_container">
                            <CommonPlaceholder v-if="store.api_statuses.show === 'loading'" mode="lg" />
                            <a v-else class="btn_e btn_primary" :href="show_detail.link">
                                Vedi evento
                            </a>
                        </div>
                    </div>
                </div>

                <hr v-if="show_detail.description_ita" />

                <div class="show_description_container"
                    v-if="store.api_statuses.show === 'loading' || show_detail.description_ita && show_detail.description_ita.length > 0">

                    <div v-if="store.api_statuses.show === 'loading'" class="show_description_placeholder">
                        <CommonPlaceholder mode="lg" v-for="i of 3" :key="i" />
                    </div>

                    <p v-else-if="show_detail.description_ita">{{ show_detail.description_ita }}</p>
                </div>
            </div>

            <!-- Show Gallery -->
            <div class="show_gallery"
                v-if="!show_detail.images_url && store.api_statuses.show === 'loading'
                    || show_detail.images_url && !show_detail.images_url.length && store.api_statuses.show === 'loading'
                    || show_detail.images_url && show_detail.images_url.length > 0 && store.api_statuses.show !== 'loading'">

                <SectionTitle>
                    <h2 class="section-title">
                        {{ store.language === 'ita' ? 'Fotografie fiera' : 'Show Photo Gallery' }}
                    </h2>
                </SectionTitle>

                <hr />

                <ul class="gallery_container">

                    <li v-for="(img, index) in show_detail.images_url || 4" :key="index" class="thumbnail"
                        :class="store.api_statuses.show === 'loading' ? 'loading_thumb' : ''">
                        <CommonSpinner v-if="store.api_statuses.show === 'loading'" mode="spinner" size="md" />

                        <img v-else :src="store.mountUrl(img.toString())" class="thumb_img" loading="lazy"
                            :alt="store.language === 'ita' ? 'Foto ' + show_detail.label_ita + ' n' + index : 'Photo ' + show_detail.label_eng + ' n' + index"
                            @click="openModal(img.toString(), show_detail.images_url || [])" />

                        <div class="img_resize_container">
                            <img src="@/assets/icons/arrows-fullscreen.svg" alt="Zoom Icon" class="img_resize"
                                loading="eager" />
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.btn_back_container {
    text-align: right;
    padding: 0.5rem 1rem;

    img {
        filter: invert(1);
        margin-right: .25rem;
    }
}

.show_details_container {
    border-radius: var(--border_radius);
    box-shadow: 0 0 3px #313131;
    background: rgba(239, 239, 239, 0.856);
    border: 0.5px solid rgba(133, 133, 133, 0.733);
    padding: 1rem;
    width: 95%;
    margin: 1.5rem auto;

    @media screen and (min-width: 768px) {
        width: 85%;
    }

    @media screen and (min-width: 900px) {
        width: 80%;
    }

    @media screen and (min-width: 1200px) {
        width: 70%;
    }


    .show_description_container {
        padding: .4rem 0;
        margin: 1rem 0;

        .show_description_placeholder>* {
            margin: .75rem 0;
            padding: .65rem;
        }
    }

    .maim_v {
        @include flexmin(stretch, center, column, null, 1rem);
        text-align: center;
        padding: .75rem 0;

        @media screen and (min-width: 580px) {
            flex-direction: row;
            align-items: stretch;
            justify-content: space-between;
            text-align: start;
        }

        .image_container {
            flex-shrink: 0;
            width: 220px;
            height: 220px;
            border-radius: 6px;
            border: .4px solid #b8b8b8c0;
            background-color: #e4e4e4;
            align-content: center;

            img {
                @extend %full_wh;
                object-fit: cover;
            }
        }

        .show_details_description {
            width: 100%;
            padding-left: .5rem;
            margin: 0 auto;
            align-self: flex-start;
            justify-self: start;

            @media screen and (min-width: 768px) {
                width: 50%;
                padding: 0;
                margin-left: 0;
                margin-left: .75rem;
            }

            .pl {
                margin: 1.75rem 0 1.15rem;
            }

            h1 {
                margin-bottom: .45rem;
                color: var(--secondary-color);

                span {
                    font-weight: bold;
                }
            }

            p {
                padding: .25rem 0;
                font-style: italic;
                border-radius: 6px;
                margin: .75rem 0;

                img {
                    margin-right: .35rem;
                    width: 1rem;
                    vertical-align: middle;
                }

            }

            .location {
                font-weight: bold;
                vertical-align: middle;
            }

            .show_btn_container {
                margin: auto;
                margin-top: 2rem;
                width: 6.5rem;

                @media screen and (min-width: 580px) {
                    margin: 0;
                    margin-top: 2.5rem;
                }

                .btn_e {
                    padding: .25rem;
                    font-size: .85rem;
                }

            }

        }
    }
}

.show_gallery {
    margin: 1rem auto;

    hr {
        margin: 0 0 .5rem 0;
    }

    .gallery_container {
        @include flexmin(start, center, null, wrap, 1.55rem);
        margin: 1rem;

        .img_resize_container {
            @extend %fx_center;
            display: none;
            width: 30px;
            height: 30px;
            border-radius: var(--border_round);
            background: var(--secondary-color);

            position: absolute;
            top: 5px;
            right: 5px;

            img {
                width: 15px;
                height: 15px;
            }
        }

        .img_resize {
            display: block;
            filter: invert(1);
            width: 20px;
            height: 20px;
        }

        .thumbnail {
            position: relative;
            transition: all linear 0.3s;
            cursor: pointer;
            border: .4px solid #b8b8b8c0;
            box-shadow: 0 0 3px #313131;
            border-radius: var(--border_radius);

            width: 125px;
            height: 125px;

            &:hover {
                transform: scale(1.05);
                filter: brightness(0.8);
            }

            &:hover .img_resize_container {
                display: flex;
            }

            &.loading_thumb {
                align-content: center;
                background: lightgray;
                border-radius: 6px;
                background-color: #e4e4e4;
            }

            .thumb_img {
                @extend %full_wh;
                border-radius: var(--border_radius);
                object-fit: cover;
            }
        }
    }
}
</style>